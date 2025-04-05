
# Realtime Innovation Employee App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 19 and Node – 20

## Clone
To clone the project use the command - 
`git clone https://github.com/Jidnyasa01Gondane/realtime-innovations` 

## Project Setup

1.	In your cloned app folder,
- Do `npm i` to install all the dev dependencies.
- I am using Ionic framework for this project, you can now run the project using the command – `ionic serve`.

## Running Lint

### Linting the application 
- Run `npm run lint` to lint the application

### Resolve Prettier format error
- If you are getting prettier-format error while linting the application use command - `npm run prettier-format`to format the code as per the standards that are set in the `.prettierrc.json` file.

Resolve all the error related to lint. It should always be successful.

## Preview
You can preview the deployed application using link added the About section of the repo.

## Implemetation Details
- Have used Ionic framework for Responsive implemetation.
- Have used `ngx-indexed-db` library for the IndexDB storage implemtation
- Have hosted the code via Fibrebase and have also activate pipeline for automate build operations.
- For Signal implations
   - The employee list is Writable signals.
   - The current and previous employee are computed signals.
