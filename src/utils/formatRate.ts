// Formate un taux monétaire à la française, ex. 0.4 -> "0,40"
export const formatRate = (rate: number): string => rate.toFixed(2).replace(".", ",");
