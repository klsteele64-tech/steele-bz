export const LINKS = {
  orderOnline: "https://burgerbudspnw.square.site/",
  website: "https://www.burgerbudspnw.com/",
  ourStory: "https://www.burgerbudspnw.com/our-story",
  locations: "https://www.burgerbudspnw.com/locations",
  facebook: "https://www.facebook.com/burgerbudspnw",
  instagram: "https://www.instagram.com/burgerbudspnw",
} as const;

export type HoursRow = { label: string; time: string };

/** Operating hours match both Enumclaw and Maple Valley per burgerbudspnw.com/locations */
export const OPERATING_HOURS: HoursRow[] = [
  { label: "Monday", time: "4:00 PM – 8:00 PM" },
  { label: "Tuesday – Thursday", time: "11:00 AM – 8:00 PM" },
  { label: "Friday – Saturday", time: "11:00 AM – 9:00 PM" },
  { label: "Sunday", time: "11:00 AM – 8:00 PM" },
];

export type LocationInfo = {
  id: string;
  name: string;
  lines: string[];
};

export const LOCATIONS: LocationInfo[] = [
  {
    id: "enumclaw",
    name: "Enumclaw",
    lines: [
      "We’re proud to call Headworks Brewing our home in Enumclaw!",
      "Come grab a pint, crush a burger, and hang with us!",
      "We are located in the alley right next to Headworks Brewing.",
      "1110 Marshall Ave, Enumclaw, WA 98022",
    ],
  },
  {
    id: "maple-valley",
    name: "Maple Valley",
    lines: [
      "We’re proud to serve the Maple Valley community at Imbibe Bottle House & Taproom, bringing our craft smash burgers to one of the best local spots around.",
      "We’re serving your favorites seven days a week alongside an incredible lineup of craft beers. Imbibe is 21+, but our burgers are always happy to go home with you!",
      "23330 Maple Valley-Black Diamond Rd, Maple Valley, WA 98038",
    ],
  },
];

export type MenuItem = {
  name: string;
  price: string;
  description?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  intro?: string;
  items: MenuItem[];
};

export const TAGLINE = "Enumclaw & Maple Valley, WA";

export const HERO_COPY = {
  title: "Burger Buds",
  subtitle: TAGLINE,
  body: `At Burger Buds, we take the art of burger making seriously. Our food trucks are built on a foundation of passion and a commitment to using only the highest quality ingredients to craft exceptional burgers. We understand that quality ingredients alone are not enough; skill and finesse are essential.

So, whether you're indulging in our Simple Smash or savoring the flavors of our gourmet specialty creations, rest assured that Burger Buds takes the pursuit of burger perfection very seriously. We invite you to taste the difference and join us on this passionate culinary adventure – one bite at a time.`,
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "smash-burgers",
    title: "Smash burgers",
    intro:
      "A thin patty of seasoned ground chuck that is flawlessly smashed onto the flat top, creating a crispy, caramelized exterior that locks in all the delicious juices. Our burgers come standard 1/4lb ensuring that you don’t miss out on the beef!",
    items: [
      {
        name: "Proper Patty",
        price: "$12",
        description:
          "Double smash patty, American cheese, shredded lettuce, Buds sauce, pickles, tomato",
      },
      {
        name: "Pit Boss",
        price: "$13",
        description:
          "Double smash patty, American cheese, BBQ sauce, grilled onions, Mama Lil's peppers, jalapeños, bacon",
      },
      {
        name: "The Big Rig",
        price: "$15",
        description:
          "Quad smash patty, American cheese, pickled red onions, lettuce, Bud's sauce, bacon",
      },
      {
        name: "The Ringer",
        price: "$12",
        description:
          "Double smash patty, American cheese, grilled onions, barbecue sauce, pickles, French's fried onions",
      },
      {
        name: "Wenatchee",
        price: "$15",
        description:
          "Double smash patty, Granny Smith apples, bacon, balsamic, roasted garlic aioli, Gorgonzola crumble",
      },
      {
        name: "Lil’ Bud",
        price: "$9",
        description: "Double smash patty, American cheese, ketchup, mustard",
      },
      {
        name: "Simple Smash",
        price: "$11",
        description:
          "Double smash patty, shredded lettuce, Bud’s sauce, American cheese",
      },
      {
        name: "Burger Bowl",
        price: "+$1",
        description:
          "All the flavor, none of the bun. Your favorite burger served on a bed of shredded lettuce. Add to any burger.",
      },
    ],
  },
  {
    id: "chicken",
    title: "Chicken",
    items: [
      {
        name: "Chicken Sammy",
        price: "$13",
        description:
          "Buttermilk chicken, pickles, Bud’s sweet chili sauce, shredded lettuce",
      },
      {
        name: "Chicken strip basket — 2 strips & fries",
        price: "$10",
      },
      {
        name: "Chicken strip basket — 4 strips & fries",
        price: "$15",
      },
    ],
  },
  {
    id: "other-grill",
    title: "Other grill favorites",
    items: [
      {
        name: "Grilled Cheese",
        price: "$7",
        description: "American cheese melted to perfection on a toasted bun!",
      },
    ],
  },
  {
    id: "sides-sweets",
    title: "Sides & sweets",
    items: [
      {
        name: "French Fries",
        price: "$6",
        description:
          "1/4 cut skin-on french fries, tossed in waygu beef tallow & salted.",
      },
      {
        name: "Moon Rocks",
        price: "$7",
        description:
          "Crispy, sweet & fluffy dessert sticks, served with cream cheese frosting!",
      },
    ],
  },
  {
    id: "customize",
    title: "Make it your own!",
    items: [
      {
        name: "Veggies",
        price: "+$1.00",
        description:
          "Shredded lettuce, tomato, fried onions, grilled onions, pickles.",
      },
      {
        name: "Meat",
        price: "+$2.00",
        description: "Add additional smash patty or bacon.",
      },
      {
        name: "Cheese",
        price: "+$1.00",
        description: "American cheese.",
      },
      {
        name: "Available add-ons",
        price: "",
        description: "Ask us what’s available when you order.",
      },
    ],
  },
];

export const NAV_LABELS: Record<string, string> = {
  "smash-burgers": "Smash burgers",
  chicken: "Chicken",
  "other-grill": "Grill",
  "sides-sweets": "Sides",
  customize: "Customize",
};
