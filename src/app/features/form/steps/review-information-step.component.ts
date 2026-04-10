import { ChangeDetectionStrategy, Component, input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormGroup, ReactiveFormsModule } from "@angular/forms"

@Component({
  selector: "app-review-information-step",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./review-information-step.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewInformationStepComponent {
  readonly form = input.required<FormGroup>()

  getSelectedPaymentModes(): string {
    const paymentModes = this.form().get("currentModeOfPayment")?.value
    if (!paymentModes) return ""

    const selectedModes: string[] = []
    if (paymentModes.cash) selectedModes.push("Cash")
    if (paymentModes.eWallets) selectedModes.push("E-Wallets")
    if (paymentModes.qrph) selectedModes.push("QRPH")
    if (paymentModes.cardPayment) selectedModes.push("Card Payment")

    return selectedModes.length > 0 ? selectedModes.join(", ") : ""
  }
}
