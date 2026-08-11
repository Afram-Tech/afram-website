import { AffordabilityCalculator } from "@/features/landing/AffordabilityCalculator";
import {
  INCOME_MAX,
  INCOME_MIN,
  INCOME_STEP,
  type RecommendedProperty,
  clampToStep,
  priceToIncome,
  toGhs,
} from "@/features/landing/affordability";
import { getAllProperties } from "@/features/landing/data/properties";

const DEFAULT_INCOME = 8000;

export async function AffordabilityCalculatorSection() {
  const properties = await getAllProperties();

  const recommendations: RecommendedProperty[] = properties
    .filter((property) => property.price > 0 && property.image)
    .map((property) => ({
      slug: property.slug,
      name: property.name,
      location: property.location,
      image: property.image,
      price: property.price,
      currency: property.currency,
      priceGhs: toGhs(property.price, property.currency),
    }))
    .sort((a, b) => a.priceGhs - b.priceGhs);

  const cheapest = recommendations[0];
  const initialIncome = cheapest
    ? clampToStep(priceToIncome(cheapest.priceGhs), INCOME_MIN, INCOME_MAX, INCOME_STEP)
    : DEFAULT_INCOME;

  return <AffordabilityCalculator initialIncome={initialIncome} properties={recommendations} />;
}
