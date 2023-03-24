const colors = [
    "#fd8985",
    "#4ea7ff",
    "#88bdbd",
    "#d3bce1",
    "#838383"
];

export const getPetColor = (pets) => {
    let usedColors = [];
    if (Array.isArray(pets) && pets.length > 0) {
        usedColors = pets
            .map(pet => "color" in pet ? pet.color : null)
            .reduce((acc, curr) => {
                if (curr !== null && !acc.includes(curr)) {
                    acc.push(curr);
                }
                return acc;
            }, []);
    }

    let usableColors = [ ...colors ];
    if (usedColors.length === usableColors.length) {
        usableColors = usableColors.filter(color => color !== pets[ pets.length - 1 ].color);
    } else {
        usableColors = usableColors.filter(color => !usedColors.includes(color));
    }

    return usableColors[ Math.floor(Math.random() * usableColors.length) ];
};