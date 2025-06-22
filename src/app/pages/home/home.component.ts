import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  unit = 0;
  currUnit = 0;
  prevUnit = 0;
  subtotal = 0;
  total = 0;
  vat = 0;
  demand_charge = 42.0 * 2;

  tiers = [
    { unit: 75, price: 5.26 },
    { unit: 125, price: 7.2 },
    { unit: 100, price: 7.59 },
    { unit: 100, price: 8.02 },
    { unit: 200, price: 12.67 },
    { unit: 10000, price: 14.61 },
  ];

  breakdowns: any[] = [];

  calculateTotal() {
    this.subtotal = 0;
    this.breakdowns = [];
    this.unit = this.currUnit - this.prevUnit;
    let remainingUnits = this.unit;
    for (let tier of this.tiers) {
      if (remainingUnits > 0) {
        const unitsInTier = Math.min(tier.unit, remainingUnits);
        this.subtotal += unitsInTier * tier.price;
        remainingUnits -= unitsInTier;
        this.breakdowns.push({
          unit: unitsInTier,
          price: tier.price,
          total: unitsInTier * tier.price,
        });
      }
    }

    this.vat = (this.subtotal + this.demand_charge) * 0.05; // 5% VAT
    this.total = this.subtotal + this.vat + this.demand_charge;
  }
}
