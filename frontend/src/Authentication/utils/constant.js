export const loginFormFields = [
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        icon: 'user',  // Font Awesome user icon
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        icon: 'lock',  // Font Awesome lock icon
    },
]
export const createSchoolFormFields=[
    {
        name: 'name',
        label: 'School Name',
        type: 'text',
        required: true,
        icon: 'school'

    },
    {
        name: 'email',
        label: 'Email',
        type: 'text',
        icon: 'envelope',  // Font Awesome envelope icon
        required: true,
    },
    {
        name: 'contact_number',
        label: 'Contact Number',
        type: 'text',
        required: true,
        icon : 'phone'
    },
    {
        name: 'username',
        label: 'Admin Username',
        type: 'text',
        required: true,
        icon: 'user',  // Font Awesome user icon
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        icon: 'lock',  // Font Awesome lock icon
    },
    {
        name: 'school_acronym',
        label: 'School Acronym',
        type: 'text',
        required: true,
    },
    {
        name: 'module',
        label: 'Module',
        type: 'select',
        icon: 'globe',  // Font Awesome globe icon
        required: true,
        options: [],
    },
    {
        name: 'cambridge_certified',
        label: 'Cambridge Certified',
        type: 'checkbox',
        required: false,
        icon: 'certificate'
    },
   
]