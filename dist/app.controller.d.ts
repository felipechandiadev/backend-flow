export declare class AppController {
    getRoot(): {
        name: string;
        version: string;
        status: string;
        endpoints: {
            health: string;
            auth: {
                login: string;
            };
            pointsOfSale: {
                list: string;
            };
            cashSessions: {
                list: string;
                getById: string;
                open: string;
            };
            treasuryAccounts: {
                list: string;
            };
            customers: {
                create: string;
                search: string;
            };
            products: {
                search: string;
            };
        };
    };
}
