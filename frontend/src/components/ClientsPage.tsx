import { FC } from "react";
import { Page } from "../types";

interface ClientsPageProps {
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}
const ClientsPage: FC<ClientsPageProps> = ({setPage}) => {
    return (
        <div>
        <h1>Clients</h1>
        <p>List of clients will be displayed here.</p>
        </div>
    );
}

export default ClientsPage;
