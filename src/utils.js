export const percentDifference = (a, b) => {
    return +(100 * Math.abs( (a - b) / ((a + b) / 2) )).toFixed(2)
}

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)