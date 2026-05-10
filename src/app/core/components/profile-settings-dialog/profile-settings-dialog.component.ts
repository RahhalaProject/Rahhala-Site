import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../services/auth.service';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { MyProfileResponse } from '../../models/user-profile.model';
import { resolveProfilePictureUrl } from '../../utils/profile-picture-url';

@Component({
  selector: 'app-profile-settings-dialog',
  standalone: true,
  templateUrl: './profile-settings-dialog.component.html',
  styleUrl: './profile-settings-dialog.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    TranslateModule,
  ],
})
export class ProfileSettingsDialogComponent implements OnChanges {
  private readonly userProfileService = inject(UserProfileService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly appConfig = inject(APP_CONFIG) as AppConfig;

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  loading = false;
  saving = false;
  uploadingPhoto = false;
  private profileId = '';

  firstName = '';
  lastName = '';
  email = '';
  address = '';
  phoneNumber = '';
  profilePictureUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.loadProfile();
    }
  }

  onVisibleChange(v: boolean): void {
    this.visibleChange.emit(v);
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  get avatarImage(): string {
    return this.resolveImageUrl(this.profilePictureUrl);
  }

  private resolveImageUrl(url: string | null | undefined): string {
    return resolveProfilePictureUrl(url, this.appConfig.apiUrl);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.uploadingPhoto = true;
    this.userProfileService.uploadSingleImage(file).subscribe({
      next: (url) => {
        this.uploadingPhoto = false;
        if (url?.trim()) {
          this.profilePictureUrl = url.trim();
        }
      },
      error: () => {
        this.uploadingPhoto = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('error') || 'Error',
          detail:
            this.translate.instant('photoUploadError') ||
            'Failed to upload photo.',
        });
      },
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.userProfileService.getMyProfile().subscribe({
      next: (p) => this.patchFromProfile(p),
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('error') || 'Error',
          detail:
            this.translate.instant('profileLoadError') ||
            'Failed to load profile.',
        });
        this.close();
      },
    });
  }

  private patchFromProfile(p: MyProfileResponse): void {
    this.profileId = p.id;
    this.firstName = p.firstName ?? '';
    this.lastName = p.lastName ?? '';
    this.email = p.email ?? '';
    this.address = p.address ?? '';
    this.phoneNumber = p.phoneNumber ?? '';
    this.profilePictureUrl = p.profilePictureUrl ?? null;
    this.loading = false;
    this.authService.applyProfileToCurrentUser({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phoneNumber: p.phoneNumber,
      profilePictureUrl: p.profilePictureUrl,
      address: p.address,
    });
  }

  save(): void {
    const fn = this.firstName.trim();
    const ln = this.lastName.trim();
    const em = this.email.trim();
    if (!fn || !ln || !em) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant('error') || 'Error',
        detail:
          this.translate.instant('pleaseCompleteRequiredFields') ||
          'Please complete required fields.',
      });
      return;
    }

    this.saving = true;
    this.userProfileService
      .updateMyProfile({
        firstName: fn,
        lastName: ln,
        email: em,
        address: this.address.trim(),
        profilePictureUrl: this.profilePictureUrl?.trim() || null,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.authService.applyProfileToCurrentUser({
            id: this.profileId || this.authService.currentUserValue?.userId || '',
            firstName: fn,
            lastName: ln,
            email: em,
            phoneNumber: this.phoneNumber,
            profilePictureUrl: this.profilePictureUrl?.trim() || null,
            address: this.address.trim() || null,
          });
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('save') || 'Save',
            detail:
              this.translate.instant('profileSaveSuccess') ||
              'Profile updated successfully.',
          });
          this.visibleChange.emit(false);
        },
        error: () => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('error') || 'Error',
            detail:
              this.translate.instant('profileSaveError') ||
              'Could not save profile.',
          });
        },
      });
  }
}
