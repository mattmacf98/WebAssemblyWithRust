use yew::prelude::*;
use web_sys::console;

struct Model {
    value: i64
}

#[function_component(App)]
fn app() -> Html {
    let state = use_state(|| Model {
        value: 0
    });

    let increment = {
        let state = state.clone();

        Callback::from(move |_| {
            console::log_1(&"Plus 1".into());
            state.set(Model {value: state.value + 1});
        })
    };

    let decrement = {
        let state = state.clone();

        Callback::from(move |_| {
            console::log_1(&"Minus 1".into());
            state.set(Model {value: state.value - 1});
        })
    };

    html! {
        <div>
            <button onclick={increment}>{"Increment"}</button>
            <button onclick={decrement}>{"Decrement"}</button>
            <p>{state.value}</p>
        </div>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
