import { type AudioConfig, type StsConfig, type Voice } from "app/utils/deepgramUtils";

const audioConfig: AudioConfig = {
  input: {
    encoding: "linear16",
    sample_rate: 16000,
  },
  output: {
    encoding: "linear16",
    sample_rate: 24000,
    container: "none",
  },
};

const baseConfig = {
  type: "SettingsConfiguration",
  audio: audioConfig,
  agent: {
    listen: { model: "nova-2" },
    speak: { model: "aura-asteria-en" },
    think: {
      provider: { type: "open_ai" },
      model: "gpt-4o",
    },
  },
};

export const stsConfig: StsConfig = {
  ...baseConfig,
  agent: {
    ...baseConfig.agent,
    think: {
      ...baseConfig.agent.think,
      provider: { type: "open_ai", fallback_to_groq: true },
      instructions: `
                ## Base instructions
                You are a helpful voice assistant made by Deepgram's engineers.
                Respond in a friendly, human, conversational manner.
                YOU MUST answer in 1-2 sentences at most when the message is not empty.
                Always reply to empty messages with an empty message.
                Ask follow up questions.
                Ask one question at a time.
                Your messages should have no more than than 120 characters.
                Do not use abbreviations for units.
                Separate all items in a list with commas.
                Keep responses unique and free of repetition.
                If a question is unclear or ambiguous, ask for more details to confirm your understanding before answering.
                If someone asks how you are, or how you are feeling, tell them.
                Deepgram gave you a mouth and ears so you can take voice as an input. You can listen and speak.
                Your name is Voicebot.
                `,
      functions: [],
    },
  },
};

// Drive-thru constants
export const driveThruStsConfig = (id: string, menu: string): StsConfig => ({
  ...baseConfig,
  context: {
    messages: [
      {
        role: "assistant",
        content: "Welcome to the Krusty Krab drive-thru. What can I get for you today?",
      },
    ],
    replay: true,
  },
  agent: {
    ...baseConfig.agent,
    think: {
      ...baseConfig.agent.think,
      instructions:
        "You work taking orders at a drive-thru. Only respond in 2-3 sentences at most. Don't mention prices until the customer confirms that they're done ordering. The menu, including the names, descriptions, types, and prices for the items that you sell, is as follows:" +
        menu,
      functions: [
        {
          name: "add_item_to_order",
          description:
            "Adds an item to the customer's order. The item must be on the menu. The tool will add the requested menu item to the customer's order. It should only be used when the user explicitly asks for a particular item. Only add the exact item a customer asks for.",
          url: `${process.env.NEXT_PUBLIC_DRIVE_THRU_API_URL}/calls/${id}/order/items`,
          method: "post",
          headers: [],
          parameters: {
            type: "object",
            properties: {
              item: {
                type: "string",
                description:
                  "The name of the item that the user would like to order. The valid values come from the names of the items on the menu.",
              },
            },
            required: ["item"],
          },
        },
        {
          name: "get_order",
          description:
            "Gets the order, including all items and their prices. Use this function when cross-checking things like the total cost of the order, or items included in the order.",
          parameters: {},
          url: `${process.env.NEXT_PUBLIC_DRIVE_THRU_API_URL}/calls/${id}/order`,
          method: "get",
          headers: [],
        },
        {
          name: "remove_item_from_order",
          description:
            "Removes an item to the customer's order. The item must be on the menu and in the order. The tool will remove the requested menu item from the customer's order. It should only be used when the user explicitly asks to remove a particular item. Only remove the exact item a customer asks for.",
          url: `${process.env.NEXT_PUBLIC_DRIVE_THRU_API_URL}/calls/${id}/order/items`,
          method: "delete",
          headers: [],
          parameters: {
            type: "object",
            properties: {
              item: {
                type: "string",
                description:
                  "The name of the item that the user would like to remove. The valid values come from the names of the items on the menu and in the order.",
              },
            },
            required: ["item"],
          },
        },
        {
          name: "get_menu",
          description:
            "Gets the menu, including all items and their price and description. Use this function at the beginning of the call and use it to reference what items are available and information about them",
          url: `${process.env.NEXT_PUBLIC_DRIVE_THRU_API_URL}/menu`,
          method: "get",
          headers: [],
          parameters: {},
        },
      ],
    },
  },
});

export const driveThruMenu = [
  {
    name: "Krabby Patty",
    description: "The signature burger of the Krusty Krab, made with a secret formula",
    price: 2.99,
    category: "meal",
  },
  {
    name: "Double Krabby Patty",
    description: "A Krabby Patty with two patties.",
    price: 3.99,
    category: "meal",
  },
  {
    name: "Krabby Patty with Cheese",
    description: "A Krabby Patty with a slice of cheese",
    price: 3.49,
    category: "meal",
  },
  {
    name: "Double Krabby Patty with Cheese",
    description: "A Krabby Patty with two patties and a slice of cheese",
    price: 4.49,
    category: "meal",
  },
  {
    name: "Salty Sea Dog",
    description: "A hot dog served with sea salt",
    price: 2.49,
    category: "meal",
  },
  {
    name: "Barnacle Fries",
    description: "Fries made from barnacles",
    price: 1.99,
    category: "side",
  },
  {
    name: "Krusty Combo",
    description: "Includes a Krabby Patty, Seaweed Salad, and a drink",
    price: 6.99,
    category: "combo",
  },
  {
    name: "Seaweed Salad",
    description: "A fresh salad made with seaweed",
    price: 2.49,
    category: "side",
  },
  {
    name: "Krabby Meal",
    description: "Includes a Krabby Patty, fries, and a drink",
    price: 5.99,
    category: "combo",
  },
  {
    name: "Kelp Shake",
    description: "A shake made with kelp juice",
    price: 2.49,
    category: "beverage",
  },
  {
    name: "Bubbly buddy",
    description: "A drink that is bubbly and refreshing",
    price: 1.49,
    category: "beverage",
  },
];

// Voice constants
const voiceAsteria: Voice = {
  name: "Asteria",
  canonical_name: "aura-asteria-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/asteria.jpg",
    color: "#7800ED",
    sample: "https://static.deepgram.com/examples/voices/asteria.wav",
  },
};
const voiceOrion: Voice = {
  name: "Orion",
  canonical_name: "aura-orion-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/orion.jpg",
    color: "#83C4FB",
    sample: "https://static.deepgram.com/examples/voices/orion.mp3",
  },
};

const voiceLuna: Voice = {
  name: "Luna",
  canonical_name: "aura-luna-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/luna.jpg",
    color: "#949498",
    sample: "https://static.deepgram.com/examples/voices/luna.wav",
  },
};

const voiceArcas: Voice = {
  name: "Arcas",
  canonical_name: "aura-arcas-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/arcas.jpg",
    color: "#DD0070",
    sample: "https://static.deepgram.com/examples/voices/arcas.mp3",
  },
};

type NonEmptyArray<T> = [T, ...T[]];
export const availableVoices: NonEmptyArray<Voice> = [
  voiceAsteria,
  voiceOrion,
  voiceLuna,
  voiceArcas,
];
export const defaultVoice: Voice = availableVoices[0];

export const sharedOpenGraphMetadata = {
  title: "Voice Agent | Deepgram",
  type: "website",
  url: "/",
  description: "Meet Deepgram's Voice Agent API",
};

// Jack-in-the-Box constants
export const jitbStsConfig = (id: string, menu: string): StsConfig => ({
  ...baseConfig,
  context: {
    messages: [
      {
        role: "assistant",
        content: "Welcome to Jack in the Box. What can I get for you today?",
      },
    ],
    replay: true,
  },
  agent: {
    ...baseConfig.agent,
    think: {
      ...baseConfig.agent.think,
      instructions:
        "You work taking orders at a drive-thru. Only respond in 2-3 sentences at most. Don't mention prices until the customer confirms that they're done ordering. The menu, including the names, descriptions, types, and prices for the items that you sell, is as follows:" +
        menu,
      functions: [
        {
          name: "add_item",
          description:
            "Add an item to an order, with an optional quantity. Only use this function if the user has explicitly asked to order an item and that item is on the menu.",
          parameters: {
            type: "object",
            properties: {
              item: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "The name of the item that the user would like to order. The valid values come from the names of the items on the menu.",
                  },
                  size: {
                    type: "string",
                    description:
                      "Provide a size IF AND ONLY IF the item has sizes listed in its `pricing` field in the menu. IF AN ITEM NEEDS A SIZE, DO NOT ASSUME THE SIZE. ASK THE CUSTOMER.",
                  },
                  make_it_a_combo: {
                    type: "object",
                    description:
                      "You can provide the `make_it_a_combo` field if the user wants a combo AND the item has the `combo_entree` role in the menu. NEVER ASSUME THE SIDE OR THE DRINK. ASK THE CUSTOMER. The size is for the drink and the fries, so the two sizes will always be the same within a combo, and that is just called the 'combo size'.",
                    properties: {
                      size: {
                        type: "string",
                        description:
                          "`small`, `medium`, or `large`. This affects the size of both the side and the drink.",
                      },
                      side_name: {
                        type: "string",
                        description:
                          "The name of the side. It must be a valid menu item and have the `combo_side` role.",
                      },
                      drink_name: {
                        type: "string",
                        description:
                          "The name of the drink. It must be a valid menu item and have the `combo_drink` role.",
                      },
                    },
                    required: ["size", "side_name", "drink_name"],
                  },
                  additional_requests: {
                    type: "string",
                    description:
                      "Optional. This is where you should include any extra customization requested by the customer for this item.",
                  },
                },
                required: ["name"],
              },
              quantity: {
                type: "integer",
                description:
                  "The quantity of this item that the user would like to add. Optional. Remember that this parameter is a sibling of item, not a child.",
              },
            },
            required: ["item"],
          },
          url: `${process.env.NEXT_PUBLIC_JITB_API_URL}/calls/${id}/order/items`,
          method: "post",
          headers: [],
        },
        {
          name: "remove_item",
          description: "Removes an item from an order.",
          parameters: {
            type: "object",
            properties: {
              key: {
                type: "integer",
                description:
                  "The integer key of the item you would like to remove. You will see these keys in the order summary that you get after each successful function call.",
              },
            },
            required: ["key"],
          },
          url: `${process.env.NEXT_PUBLIC_JITB_API_URL}/calls/${id}/order/items`,
          method: "delete",
          headers: [],
        },
      ],
    },
  },
});
export const latencyMeasurementQueryParam = "latency-measurement";
