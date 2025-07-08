export const CREDITS_PACKS = [10, 20, 50, 100];

export const PLAN_IDS = {
    UNLIMITED_YEARLY: {
        id: 'plan_Qq3Anp6y7qtpWD',
        planName: 'Unlimited Yearly',
        description: 'Yearly subscription, 2 months free',
        totalBillingCycleCount: 5
    },
    UNLIMITED_MONTHLY: {
        id: 'plan_Qq35Ed263nsOOQ',
        planName: 'Unlimited Monthly',
        description: 'Monthly subscription',
        totalBillingCycleCount: 12
    }
};

export const pricingList = [
    {
    price: "Credit Packs",
        list: [
            { details: "10 CREDITS FOR ₹10" },
            { details: "20 CREDITS FOR ₹20" },
            { details: "50 CREDITS FOR ₹50" },
            { details: "100 CREDITS FOR ₹100" },
        ],
    },
        {
            price: "Unlimited Monthly",
            list: [
                {detail: "UNLIMITED LINKS" ,},
                {detail: "AUTO RENEWED" ,},
                {detail: "CHARGED MONTHLY" ,},
                {detail: "CANCEL ANYTIME" ,},

            ],
        },
        {
            price: "Unlimited Yealry",
            list: [
                {detail: "UNLIMITED LINKS" ,},
                {detail: "AUTO RENEWED" ,},
                {detail: "CHARGED Yearly" ,},
                {detail: "CANCEL ANYTIME" ,},

            ],
        },
];