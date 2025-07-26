function formatIndianCurrency(amount) {
  const parts = amount.toString().split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1] ? "." + parts[1] : "";

  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);

  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  return otherNumbers ? formatted + decimalPart : lastThree + decimalPart;
}

module.exports = { formatIndianCurrency };
