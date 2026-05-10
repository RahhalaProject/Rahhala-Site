import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  forwardRef,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="otp-boxes" dir="ltr">
      <input
        *ngFor="let _ of slots; let i = index"
        #box
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="otp-box"
        autocomplete="one-time-code"
        (input)="onInput($event, i)"
        (keydown)="onKeydown($event, i)"
        (focus)="onFocus($event)"
        (paste)="onPaste($event, i)"
      />
    </div>
  `,
  styles: [`
    .otp-boxes {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .otp-box {
      width: 52px;
      height: 52px;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      border: 1.5px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      background: #fff;
      color: #111;
      caret-color: transparent;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .otp-box:focus {
      border-color: var(--p-primary-color, #4f46e5);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
    }
  `],
})
export class OtpInputComponent implements ControlValueAccessor, Validator, OnInit {
  @Input() length = 4;

  @ViewChildren('box') boxRefs!: QueryList<ElementRef<HTMLInputElement>>;

  /** Used only as a *ngFor source — values managed directly on DOM inputs */
  slots: null[] = [];

  private values: string[] = [];
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.slots  = Array(this.length).fill(null);
    this.values = Array(this.length).fill('');
  }

  // ── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(raw: string): void {
    const chars = (raw ?? '').replace(/\D/g, '').split('');
    this.values = Array(this.length).fill('').map((_, i) => chars[i] ?? '');
    // sync DOM after view initialises
    setTimeout(() => {
      this.getBoxes().forEach((b, i) => { b.value = this.values[i]; });
    });
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void         { this.onTouched = fn; }

  // ── Validator ────────────────────────────────────────────────────────────

  validate(_: AbstractControl): ValidationErrors | null {
    return this.values.join('').length === this.length
      ? null
      : { otpIncomplete: true };
  }

  // ── Events ───────────────────────────────────────────────────────────────

  onInput(event: Event, i: number): void {
    const el    = event.target as HTMLInputElement;
    const digit = el.value.replace(/\D/g, '').slice(-1);
    this.values[i] = digit;
    el.value       = digit;
    if (digit) this.focusBox(i + 1);
    this.emit();
  }

  onKeydown(event: KeyboardEvent, i: number): void {
    const boxes = this.getBoxes();

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.values[i]) {
        this.values[i]  = '';
        boxes[i].value  = '';
      } else if (i > 0) {
        this.values[i - 1] = '';
        boxes[i - 1].value = '';
        this.focusBox(i - 1);
      }
      this.emit();
    } else if (event.key === 'ArrowLeft')  {
      event.preventDefault();
      this.focusBox(i - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusBox(i + 1);
    }
  }

  onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  onPaste(event: ClipboardEvent, from: number): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, this.length);
    const boxes  = this.getBoxes();

    [...digits].forEach((d, offset) => {
      const idx = from + offset;
      if (idx < this.length) {
        this.values[idx] = d;
        if (boxes[idx])  boxes[idx].value = d;
      }
    });

    this.focusBox(Math.min(from + digits.length, this.length - 1));
    this.emit();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private getBoxes(): HTMLInputElement[] {
    return this.boxRefs?.toArray().map(r => r.nativeElement) ?? [];
  }

  private focusBox(i: number): void {
    const boxes = this.getBoxes();
    if (i >= 0 && i < boxes.length) boxes[i].focus();
  }

  private emit(): void {
    this.onChange(this.values.join(''));
    this.onTouched();
  }
}
