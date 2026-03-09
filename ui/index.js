import { AppComponent } from "./components/App.component.js";

const rootElement = document.getElementById('root');

const renderApp = () => {
    rootElement.innerHTML = '';
    const AppComponentElement = AppComponent();

    rootElement.appendChild(AppComponentElement.element); 
}

renderApp();