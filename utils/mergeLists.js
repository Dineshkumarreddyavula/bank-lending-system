function combineLists(list1, list2) {
  const all = [...list1, ...list2].sort((a, b) => a.positions[0] - b.positions[0]);
  const result = [];

  for (const item of all) {
    let merged = false;
    for (const res of result) {
      const [l1, r1] = res.positions;
      const [l2, r2] = item.positions;
      const overlap = Math.max(0, Math.min(r1, r2) - Math.max(l1, l2));
      const len = r2 - l2;
      if (overlap >= len / 2) {
        res.values.push(...item.values);
        merged = true;
        break;
      }
    }
    if (!merged) result.push({ ...item });
  }

  return result;
}

module.exports = { combineLists };
