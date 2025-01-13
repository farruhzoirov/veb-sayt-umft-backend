const Joi = require("joi");
const {string} = require("joi");

const universitySchema = Joi.object({
    modelId: Joi.string().optional(),
    status: Joi.number().optional(),
    translate: Joi.object({
        description: Joi.string().required(),
        text: Joi.string().optional(),
        language: Joi.string().required(),
    }).required(),
});

const categorySchema = Joi.object({
    modelId: Joi.string().optional(),
    slug: Joi.string().optional(),
    status: Joi.number().optional(),
    translate: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().optional(),
        language: Joi.string().required(),
    }).required(),
});

const degreesSchema = Joi.object({
    modelId: Joi.string().optional(),
    status: Joi.number().optional(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        language: Joi.string().required(),
    }).required(),
});

// This must be changed
const specialtySchema = Joi.object({
    modelId: Joi.string().optional(),
    views: Joi.number().optional(),
    hemisId: Joi.number().optional(),
    code: Joi.string().optional(),
    department: Joi.string().optional(),
    prices: Joi.array().items(
        Joi.object({
            price: Joi.string().required(),
            format: Joi.string().optional(),
            duration: Joi.string().required()
        })),
    slug: Joi.string().optional(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().optional(),
        language: Joi.string().required(),
    }).required(),
});

const eventsCategorySchema = Joi.object({
    modelId: Joi.string().optional(),
    status: Joi.number().optional(),
    slug: Joi.string().optional(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        language: Joi.string().required(),
    }).required(),
});

const eventsSchema = Joi.object({
    modelId: Joi.string().optional(),
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    eventsCategory: Joi.array().optional(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().required(),
        address: Joi.string().required(),
        language: Joi.string().required(),
    }).required(),
});

// it must be changed
const departmentSchema = Joi.object({
    modelId: Joi.string().optional(),
    status: Joi.number().optional(),
    slug: Joi.string().optional(),
    code: Joi.string().optional(),
    hemisId: Joi.number().optional(),
    structureType: Joi.object({
        code: Joi.string().optional(),
        name: Joi.string().optional(),
    }),
    active: Joi.boolean().optional(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().required(),
        language: Joi.string().required(),
    }).required(),
});

const formatsSchema = Joi.object({
    modelId: Joi.string().optional(),
    status: Joi.number().optional(),
    slug: Joi.string().required(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().optional(),
        language: Joi.string().required(),
    }).required(),
});

const levelSchema = Joi.object({
    modelId: Joi.string().optional(),
    slug: Joi.string().required(),
    course: Joi.number().min(0).max(6).required(),
});

const newsSchema = Joi.object({
    modelId: Joi.string().optional(),
    views: Joi.number().optional(),
    slug: Joi.string().required(),
    status: Joi.number().optional(),
    translate: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        description: Joi.string().required(),
        language: Joi.string().required(),
    }).required(),
});

const partnersSchema = Joi.object({
    modelId: Joi.string().optional(),
    status: Joi.number().optional(),
    slug: Joi.string().required(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().required(),
        language: Joi.string().required(),
    }).required(),
});

const employeeSchema = Joi.object({
    hemisId: Joi.number().optional(),
    department: Joi.string().optional(),
    employeeId: Joi.number().optional(),
    socialLinks: Joi.array().items({
        messenger: Joi.string().required(),
        link: Joi.string().required(),
    }).required(),
    birthDate: Joi.date().optional(),
    slug: Joi.string().optional(),
    translate: Joi.object({
        firstName: Joi.string().optional(),
        secondName: Joi.string().optional(),
        thirdName: Joi.string().optional(),
        gender: Joi.object({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
        }).optional(),
        academicRank: Joi.object({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
        }).optional(),
        staffPosition: Joi.object({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
        }).optional(),
        employeeType: Joi.object({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
        }).optional(),
        employeeStatus: Joi.object({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
        }).optional(),
        language: Joi.string().optional(),
    }).optional()
});

const topicsSchema = Joi.object({
    modelId: Joi.string().optional(),
    specialty: Joi.string().optional(),
    slug: Joi.string().optional(),
    level: Joi.string().required(),
    translate: Joi.object({
        name: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().optional(),
        language: Joi.string().optional(),
    }).required(),
});

const themeSchema = Joi.object({
    modelId: Joi.string().optional(),
    topic: Joi.string().optional(),
    slug: Joi.string().optional(),
    translate: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().optional(),
        description: Joi.string().optional(),
        language: Joi.string().optional(),
    }).required(),
});


const pagesSchema = Joi.object({
    modelId: Joi.string().optional(),
    slug: Joi.string().required(),
    status: Joi.number().optional(),
    translate: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        description: Joi.string().required(),
        language: Joi.string().required(),
    }).required(),
});

const languagesSchema = Joi.object({
    title: Joi.string().optional(),
    slug: Joi.string().optional(),
    isDefault: Joi.boolean().optional(),
    status: Joi.number().optional(),
});

const messengerSchema = Joi.object({
    modelId: Joi.string().optional(),
    // link: Joi.string().uri().optional(),
    slug: Joi.string().optional(),
    translate: {
        name: Joi.string().required(),
        text: Joi.string().optional(),
        language: Joi.string().optional(),
    },
});

const contactSchema = Joi.object({
    slug: Joi.string().optional(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    location: Joi.array().items({
        lang: Joi.string().required(),
        lat: Joi.string().required(),
    }).required(),
    address: Joi.array().items(Joi.string()).required(),
});

const licenceSchema = Joi.object({
    title: Joi.string().optional(),
    text: Joi.string().optional(),
    file: Joi.array().items(Joi.string()).required(),
    slug: Joi.string().optional(),
});


const socialSchema = Joi.object({
    messenger: Joi.string().required(),
    link: Joi.string().required(),
    slug: Joi.string().optional(),
    status: Joi.number().optional(),
    translate: Joi.object({
        title: Joi.string().optional(),
        text: Joi.string().optional(),
        language: Joi.string().optional()
    }).required()
})


module.exports = {
    category: categorySchema,
    university: universitySchema,
    degree: degreesSchema,
    specialty: specialtySchema,
    events: eventsSchema,
    eventsCategory: eventsCategorySchema,
    department: departmentSchema,
    format: formatsSchema,
    level: levelSchema,
    news: newsSchema,
    partner: partnersSchema,
    employee: employeeSchema,
    topic: topicsSchema,
    theme: themeSchema,
    page: pagesSchema,
    language: languagesSchema,
    messenger: messengerSchema,
    contact: contactSchema,
    licence: licenceSchema,
    social: socialSchema
};
