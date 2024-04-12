import {Express} from 'express';

const appSetup = async (app: Express) => {

    try {
        console.log('Databases connected successfully!');
        const PORT = Number(process.env.PORT) || 3000;

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });

    } catch (error: unknown) {
        console.log('Unable to start the app!');
        console.error(error);
    }
};

export default appSetup;
