import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MegaMenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { MegaMenu } from 'primeng/megamenu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { AuthService } from '../../services/auth.service';
import { ProfileSettingsDialogComponent } from '../profile-settings-dialog/profile-settings-dialog.component';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { User } from '../../models/user.model';
import { Subscription, filter } from 'rxjs';
import { resolveProfilePictureUrl } from '../../utils/profile-picture-url';
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    MenubarModule,
    MegaMenu,
    ButtonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    PopoverModule,
    ProfileSettingsDialogComponent,
  ],
  providers: [TranslateService],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isHomeLayout: boolean = true;
  items: MegaMenuItem[] | undefined;
  supportLanguages = ['en', 'ar'];
  selectedLanguage!: string;
  currentUser: User | null = null;
  /** URL path is `/auth` (sign-in / sign-up layout). */
  isAuthEntryRoute = false;
  profileSettingsVisible = false;
  private subscriptions = new Subscription();

  constructor(
    readonly config: PrimeNG,
    readonly translateService: TranslateService,
    @Inject(DOCUMENT) readonly document: Document,
    readonly authService: AuthService,
    private readonly router: Router,
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'home',
        root: true,
        section: 'home',
      },
      {
        label: 'ourServices',
        root: true,
        section: 'our-services',
      },
      {
        label: 'aboutUs',
        root: true,
        section: 'whoour',
      },
      {
        label: 'support',
        root: true,
        section: 'support',
      },
      {
        label: '',
        root: false,
      },
    ];

    this.selectedLanguage =
      this.translateService.currentLang ||
      localStorage.getItem('lang') ||
      this.supportLanguages[0];

    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      })
    );

    if (!this.currentUser && this.authService.isLoggedIn()) {
      this.currentUser = this.authService.currentUserValue;
    }

    this.refreshAuthEntryRoute();
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.refreshAuthEntryRoute())
    );
  }

  private refreshAuthEntryRoute(): void {
    const path = this.router.url.split(/[?#]/)[0];
    this.isAuthEntryRoute = path === '/auth';
  }

  /** On `/auth`, show login + language in the top bar on small screens (default hides `.auth-btn`). */
  showMobileGuestAuthBar(): boolean {
    return !this.isHomeLayout && !this.isLoggedIn() && this.isAuthEntryRoute;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get profileAvatarSrc(): string {
    return resolveProfilePictureUrl(
      this.currentUser?.profilePictureUrl,
      this.appConfig.apiUrl
    );
  }

  openProfileSettings(popover: Popover): void {
    popover.hide();
    this.profileSettingsVisible = true;
  }

  get displayName(): string {
    if (!this.currentUser) return '';
    const { firstName, lastName } = this.currentUser;
    return (
      `${firstName ?? ''} ${lastName ?? ''}`.trim() || this.currentUser.email
    );
  }

  get userEmail(): string {
    return this.currentUser?.email || '';
  }

  /** Short code for header language toggle (e.g. AR / EN). */
  get currentLangCode(): string {
    return (
      this.translateService.currentLang ||
      this.selectedLanguage ||
      localStorage.getItem('lang') ||
      'en'
    ).toUpperCase();
  }

  get userInitials(): string {
    if (!this.currentUser) return '';
    const first = this.currentUser.firstName?.charAt(0) ?? '';
    const last = this.currentUser.lastName?.charAt(0) ?? '';
    return (
      `${first}${last}`.toUpperCase() ||
      this.currentUser.email.charAt(0).toUpperCase()
    );
  }

  logout(): void {
    this.authService.logout();
  }

  useLang(lang: any) {
    const selectedLang = lang.value || lang; // handle both { value: 'ar' } or 'ar'
    this.applyLang(selectedLang);
  }

  changeLang() {
    const currentLang =
      this.translateService.currentLang || localStorage.getItem('lang') || 'en';
    this.applyLang(currentLang === 'ar' ? 'en' : 'ar');
  }

  private applyLang(lang: string): void {
    this.selectedLanguage = lang;
    this.translateService.use(lang);
    localStorage.setItem('lang', lang);

    this.translateService.get('primeng').subscribe((res) => {
      this.config.setTranslation(res);
    });

    const html = this.document.documentElement as HTMLElement;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.classList.remove('rtl', 'ltr');
    html.classList.add(lang === 'ar' ? 'rtl' : 'ltr');

    // Re-navigate to the current route so all components reload and re-fetch APIs
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
