export type RoomType =
  | 'south-indian'
  | 'mughlai'
  | 'chinese'
  | 'continental'
  | 'desserts'
  | 'prep'
  | 'walkin'
  | 'dry'
  | 'wash'
  | 'packing'
  | 'receiving'
  | 'staff'

export type Dir = 'n' | 's' | 'e' | 'w'

export interface Room {
  id: string
  name: string
  type: RoomType
  /** West edge, feet from west wall */
  x: number
  /** North edge, feet from north wall */
  z: number
  w: number
  d: number
  /** Openings toward aisles */
  doors: Dir[]
  solid?: boolean
}

export interface Layout {
  id: string
  code: string
  name: string
  summary: string
  rooms: Room[]
}

export const SIZE = 60
export const WALL = 0.45
export const CEILING = 13

const cookDoors = (extra: Dir[] = []): Dir[] => extra

export const layouts: Layout[] = [
  {
    id: 'A',
    code: 'A',
    name: 'Five stations in a line',
    summary:
      'Five equal cook bays on the north exhaust wall. Shared prep in the middle, packing stacked on the east.',
    rooms: [
      r('a-si', 'South Indian', 'south-indian', 0, 0, 8.8, 16.1, ['s']),
      r('a-mu', 'Mughlai', 'mughlai', 12.8, 0, 8.8, 16.1, ['s']),
      r('a-ch', 'Chinese', 'chinese', 25.6, 0, 8.8, 16.1, ['s']),
      r('a-co', 'Continental', 'continental', 38.4, 0, 8.8, 16.1, ['s']),
      r('a-de', 'Desserts', 'desserts', 51.2, 0, 8.8, 16.1, ['s']),
      r('a-prep', 'Veg / non-veg prep', 'prep', 0, 20.1, 34.8, 11.4, ['n', 's']),
      r('a-wash', 'Wash', 'wash', 38.8, 20.1, 21.2, 10.0, ['s', 'w']),
      r('a-dry', 'Dry store', 'dry', 0, 35.6, 13.4, 10.2, ['s', 'e'], true),
      r('a-cold', 'Walk-in cold + freezer', 'walkin', 17.4, 35.6, 17.4, 10.2, ['s'], true),
      r('a-recv', 'Receiving + staff entry', 'receiving', 0, 49.8, 20.9, 10.2, ['n', 's']),
      r('a-staff', 'Staff, lockers, WC, office', 'staff', 20.9, 49.8, 13.9, 10.2, ['n'], true),
      r('a-pack', 'Packing + dispatch', 'packing', 38.8, 34.1, 21.2, 25.9, ['w', 's']),
    ],
  },
  {
    id: 'B',
    code: 'B',
    name: 'Shared hot line + dessert room',
    summary:
      'Four hot brands share the north hood. Desserts get a tall dedicated room. Wash sits next to dispatch.',
    rooms: [
      r('b-si', 'South Indian', 'south-indian', 0, 0, 10.3, 14.5, ['s']),
      r('b-mu', 'Mughlai', 'mughlai', 10.3, 0, 10.3, 14.5, ['s']),
      r('b-ch', 'Chinese', 'chinese', 20.6, 0, 10.3, 14.5, ['s']),
      r('b-co', 'Continental', 'continental', 30.9, 0, 10.3, 14.5, ['s']),
      r('b-de', 'Desserts', 'desserts', 45.1, 0, 14.9, 33.0, ['w', 's']),
      r('b-prep', 'Veg / non-veg prep', 'prep', 0, 18.5, 13.6, 14.5, ['n', 's', 'e']),
      r('b-cold', 'Walk-in cold + freezer', 'walkin', 17.6, 18.5, 10.7, 14.5, ['s'], true),
      r('b-dry', 'Dry store', 'dry', 32.3, 18.5, 8.8, 14.5, ['s'], true),
      r('b-recv', 'Receiving + staff entry', 'receiving', 0, 37, 11.9, 23, ['n', 's']),
      r('b-staff', 'Staff, WC', 'staff', 11.9, 37, 7.9, 23, ['n'], true),
      r('b-wash', 'Wash', 'wash', 23.8, 37, 13.2, 23, ['n', 'e']),
      r('b-pack', 'Packing + dispatch', 'packing', 41, 37, 19, 23, ['n', 's', 'w']),
    ],
  },
  {
    id: 'C',
    code: 'C',
    name: 'Assembly line',
    summary:
      'West-to-east flow: receiving → prep → cook column → packing. Five brands stacked as an assembly line.',
    rooms: [
      r('c-dry', 'Dry store', 'dry', 0, 0, 10.4, 21.9, ['e'], true),
      r('c-staff', 'Staff, lockers, WC, office', 'staff', 0, 25.9, 10.4, 17, ['e'], true),
      r('c-recv', 'Receiving + staff entry', 'receiving', 0, 42.9, 10.4, 17.1, ['e', 's']),
      r('c-cold', 'Walk-in cold + freezer', 'walkin', 14.4, 0, 11.2, 22.4, ['e', 's'], true),
      r('c-prep', 'Veg / non-veg prep', 'prep', 14.4, 26.4, 11.2, 33.6, ['e', 'w', 'n']),
      r('c-si', 'South Indian', 'south-indian', 29.6, 0, 12.8, 8.8, ['e', 'w']),
      r('c-mu', 'Mughlai', 'mughlai', 29.6, 12.8, 12.8, 8.8, ['e', 'w']),
      r('c-ch', 'Chinese', 'chinese', 29.6, 25.6, 12.8, 8.8, ['e', 'w']),
      r('c-co', 'Continental', 'continental', 29.6, 38.4, 12.8, 8.8, ['e', 'w']),
      r('c-de', 'Desserts', 'desserts', 29.6, 51.2, 12.8, 8.8, ['e', 'w']),
      r('c-wash', 'Wash', 'wash', 46.4, 0, 13.6, 18.7, ['w', 's']),
      r('c-pack', 'Packing + dispatch', 'packing', 46.4, 22.7, 13.6, 37.3, ['w', 's']),
    ],
  },
  {
    id: 'D',
    code: 'D',
    name: 'Central island',
    summary:
      'Cook brands sit as a central island. Prep west, wash east, a wide packing pass on the south.',
    rooms: [
      r('d-staff', 'Staff, lockers, WC, office', 'staff', 0, 0, 20, 9.6, ['s'], true),
      r('d-dry', 'Dry store', 'dry', 20, 0, 18.2, 9.6, ['s'], true),
      r('d-cold', 'Walk-in cold + freezer', 'walkin', 38.2, 0, 21.8, 9.6, ['s'], true),
      r('d-prep', 'Veg / non-veg prep', 'prep', 0, 13.6, 13, 28.9, ['e', 's']),
      r('d-si', 'South Indian', 'south-indian', 17, 13.6, 6, 12.5, cookDoors(['n', 's', 'e', 'w'])),
      r('d-mu', 'Mughlai', 'mughlai', 27, 13.6, 6, 12.5, ['n', 's', 'e', 'w']),
      r('d-ch', 'Chinese', 'chinese', 37, 13.6, 6, 12.5, ['n', 's', 'e', 'w']),
      r('d-co', 'Continental', 'continental', 17, 30.1, 11, 12.4, ['n', 's', 'e', 'w']),
      r('d-de', 'Desserts', 'desserts', 32, 30.1, 11, 12.4, ['n', 's', 'e', 'w']),
      r('d-wash', 'Wash', 'wash', 47, 13.6, 13, 28.9, ['w', 's']),
      r('d-recv', 'Receiving + staff entry', 'receiving', 0, 46.5, 16.3, 13.5, ['n', 's', 'e']),
      r('d-pack', 'Packing + dispatch', 'packing', 20.3, 46.5, 39.7, 13.5, ['n', 's', 'w']),
    ],
  },
  {
    id: 'E',
    code: 'E',
    name: 'Galley (rows)',
    summary:
      'Three clear rows: cook, prep/cold/dry, then receiving–wash–packing. Easy for clients to read.',
    rooms: [
      r('e-si', 'South Indian', 'south-indian', 0, 0, 12.2, 13.8, ['s']),
      r('e-mu', 'Mughlai', 'mughlai', 12.2, 0, 12.2, 13.8, ['s']),
      r('e-ch', 'Chinese', 'chinese', 24.4, 0, 12.2, 13.8, ['s']),
      r('e-co', 'Continental', 'continental', 36.6, 0, 12.2, 13.8, ['s']),
      r('e-de', 'Desserts', 'desserts', 48.8, 0, 11.2, 13.8, ['s']),
      r('e-prep', 'Veg / non-veg prep', 'prep', 0, 19.8, 22.9, 13.8, ['n', 's', 'e']),
      r('e-cold', 'Walk-in cold + freezer', 'walkin', 26.9, 19.8, 15.3, 13.8, ['n', 's'], true),
      r('e-dry', 'Dry store', 'dry', 46.2, 19.8, 13.8, 13.8, ['n', 's'], true),
      r('e-recv', 'Receiving + staff entry', 'receiving', 0, 37.6, 12.6, 22.4, ['n', 's', 'e']),
      r('e-staff', 'Staff, WC', 'staff', 16.6, 37.6, 8.9, 22.4, ['n'], true),
      r('e-wash', 'Wash', 'wash', 29.5, 37.6, 12.6, 22.4, ['n', 'e']),
      r('e-pack', 'Packing + dispatch', 'packing', 42.1, 37.6, 17.9, 22.4, ['n', 's', 'w']),
    ],
  },
  {
    id: 'F',
    code: 'F',
    name: 'Two clusters (spicy | clean)',
    summary:
      'Spicy cluster west (South Indian, Mughlai, Chinese), clean cluster east (Continental, Desserts) with shared prep in the spine.',
    rooms: [
      r('f-si', 'South Indian', 'south-indian', 0, 0, 21.5, 10, ['e', 's']),
      r('f-mu', 'Mughlai', 'mughlai', 0, 14, 21.5, 10, ['e', 's', 'n']),
      r('f-ch', 'Chinese', 'chinese', 0, 28, 21.5, 10, ['e', 's', 'n']),
      r('f-prep', 'Veg / non-veg prep', 'prep', 25.5, 0, 12.4, 20.4, ['w', 'e', 's']),
      r('f-cold', 'Walk-in cold + freezer', 'walkin', 25.5, 24.4, 12.4, 13.6, ['s', 'w', 'e'], true),
      r('f-co', 'Continental', 'continental', 41.9, 0, 18.1, 17, ['w', 's']),
      r('f-de', 'Desserts', 'desserts', 41.9, 21, 18.1, 17, ['w', 's', 'n']),
      r('f-recv', 'Receiving + entry', 'receiving', 0, 42, 7.5, 18, ['n', 's']),
      r('f-staff', 'Staff, WC', 'staff', 7.5, 42, 7.1, 18, ['n'], true),
      r('f-dry', 'Dry store', 'dry', 14.6, 42, 7.1, 18, ['n'], true),
      r('f-wash', 'Wash', 'wash', 25.7, 42, 10.4, 18, ['n', 'e']),
      r('f-pack', 'Packing + dispatch', 'packing', 40.1, 42, 19.9, 18, ['n', 's', 'w']),
    ],
  },
]

function r(
  id: string,
  name: string,
  type: RoomType,
  x: number,
  z: number,
  w: number,
  d: number,
  doors: Dir[],
  solid = false,
): Room {
  return { id, name, type, x, z, w, d, doors, solid }
}

export const roomTint: Record<RoomType, string> = {
  'south-indian': '#b9a17c',
  mughlai: '#b58e7c',
  chinese: '#b5aa75',
  continental: '#829ba5',
  desserts: '#b392a0',
  prep: '#8fa28a',
  walkin: '#7fa0a4',
  dry: '#aa9677',
  wash: '#8797aa',
  packing: '#b4a16d',
  receiving: '#a99d88',
  staff: '#92919b',
}
