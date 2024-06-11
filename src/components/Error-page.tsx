import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div id="error-page">
            <h1>Упс!</h1>
            <p>Что-то пошло не так.</p>
        </div>
    );
};