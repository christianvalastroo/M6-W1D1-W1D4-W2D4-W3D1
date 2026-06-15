const { body, validationResult } = require("express-validator")

const requiredName = field => (
    body(field)
        .isString()
        .withMessage(`${field} deve essere una stringa`)
        .trim()
        .notEmpty()
        .withMessage(`${field} è obbligatorio`)
        .isLength({ max: 100 })
        .withMessage(`${field} non può superare 100 caratteri`)
)

const optionalName = field => (
    body(field)
        .optional()
        .isString()
        .withMessage(`${field} deve essere una stringa`)
        .trim()
        .notEmpty()
        .withMessage(`${field} non può essere vuoto`)
        .isLength({ max: 100 })
        .withMessage(`${field} non può superare 100 caratteri`)
)

const commonOptionalFields = [
    body("dataDiNascita")
        .optional({ values: "null" })
        .isISO8601()
        .withMessage("dataDiNascita deve essere una data valida"),
    body("avatar")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("avatar deve essere un URL valido")
]

const registerAuthorValidation = [
    requiredName("nome"),
    requiredName("cognome"),
    body("email")
        .isEmail()
        .withMessage("email deve essere valida")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("password deve essere una stringa")
        .isLength({ min: 8 })
        .withMessage("password deve contenere almeno 8 caratteri"),
    body("role")
        .not()
        .exists()
        .withMessage("Il ruolo non può essere assegnato durante la registrazione"),
    ...commonOptionalFields
]

const updateAuthorValidation = [
    optionalName("nome"),
    optionalName("cognome"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("email deve essere valida")
        .normalizeEmail(),
    body("password")
        .optional()
        .isString()
        .withMessage("password deve essere una stringa")
        .isLength({ min: 8 })
        .withMessage("password deve contenere almeno 8 caratteri"),
    body("role")
        .not()
        .exists()
        .withMessage("Usa la route amministrativa per modificare il ruolo"),
    ...commonOptionalFields
]

const updateRoleValidation = [
    body("role")
        .isIn(["user", "admin"])
        .withMessage("role deve essere user oppure admin")
]

const validateAuthorBody = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            message: "Dati autore non validi",
            errors: errors.array()
        })
    }

    next()
}

module.exports = {
    registerAuthorValidation,
    updateAuthorValidation,
    updateRoleValidation,
    validateAuthorBody
}
