const translate = (stateCode) => {
  switch (stateCode) {
    case 'Lower Silesian Voivodeship':
      return 'dolnośląskie';

    case 'Kuyavian-Pomeranian Voivodeship':
      return 'kujawsko-pomorskie';

    case 'Lubusz Voivodeship':
      return 'lubuskie';

    case 'Lesser Poland Voivodeship':
      return 'małopolskie';

    case 'Masovian Voivodeship':
      return 'mazowieckie';

    case 'Subcarpathian Voivodeship':
      return 'podkarpackie';

    case 'Pomeranian Voivodeship':
      return 'pomorskie';

    case 'Silesian Voivodeship':
      return 'śląskie';

    case 'Warmian-Masurian Voivodeship':
      return 'warmińsko-mazurskie';

    case 'Greater Poland Voivodeship':
      return 'wielkopolskie';

    case 'West Pomeranian Voivodeship':
      return 'zachodniopomorskie';

    case 'Łódź Voivodeship':
      return 'łódzkie';

    case 'Opole Voivodeship':
      return 'opolskie';

    case 'Podlaskie Voivodeship':
      return 'podlaskie';

    case 'Świętokrzyskie Voivodeship':
      return 'świętokrzyskie';

    case 'Lublin Voivodeship':
      return 'lubuskie';

    default:
      return stateCode;
  }
};

module.exports = translate;
