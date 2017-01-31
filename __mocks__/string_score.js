const stringScore = (leftString, rightString) => {
  if (parseFloat(leftString) >= parseFloat(rightString)) {
    return parseFloat(rightString)
  }

  return 0
}

module.exports = stringScore
