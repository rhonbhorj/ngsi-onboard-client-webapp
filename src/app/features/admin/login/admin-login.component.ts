import { Component, signal, inject, ChangeDetectionStrategy } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { AdminAuthService } from "../services/admin-auth.service"
import type { AdminLoginCredentials } from "../models/admin.model"

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-login.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "block",
  },
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private authService = inject(AdminAuthService)

  // State signals
  readonly isSubmitting = signal(false)
  readonly errorMessage = signal("")

  // Form
  loginForm: FormGroup

  constructor() {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })

    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/admin/dashboard"])
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true)
      this.errorMessage.set("")

      const credentials: AdminLoginCredentials = this.loginForm.value

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isSubmitting.set(false)
          if (response.message === "Login Succesful" && response.token) {
            this.authService.handleLoginSuccess(response, credentials.username)
            this.router.navigate(["/admin/dashboard"])
          } else {
            this.errorMessage.set("Username or Password is Incorrect")
          }
        },
        error: (error) => {
          this.isSubmitting.set(false)
          if (error.status === 401) {
            this.errorMessage.set("Username or Password is Incorrect")
          } else {
            this.errorMessage.set("Login failed. Please try again.")
          }
        },
      })
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName)
    return !!(field && field.invalid && field.touched)
  }
}
