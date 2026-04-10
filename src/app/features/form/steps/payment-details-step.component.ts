import { ChangeDetectionStrategy, Component, input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormControl, type FormGroup, ReactiveFormsModule } from "@angular/forms"

@Component({
  selector: "app-payment-details-step",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./payment-details-step.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailsStepComponent {
  readonly form = input.required<FormGroup>()

  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl
  }

  resetStep(): void {
    this.form().patchValue({
      hasExistingPaymentPortal: "",
      currentModeOfPayment: {
        cash: false,
        eWallets: false,
        qrph: false,
        cardPayment: false,
      },
      estimatedTransactionNumbers: "",
      estimatedAverageAmount: "",
    })
  }

  hasSelections(): boolean {
    const hasPaymentPortal = this.form().get("hasExistingPaymentPortal")?.value
    const paymentModes = this.form().get("currentModeOfPayment")?.value
    const hasTransactionNumbers = this.form().get("estimatedTransactionNumbers")?.value
    const hasAverageAmount = this.form().get("estimatedAverageAmount")?.value

    return !!(
      hasPaymentPortal ||
      (paymentModes && Object.values(paymentModes).some((mode) => mode === true)) ||
      hasTransactionNumbers ||
      hasAverageAmount
    )
  }
}
