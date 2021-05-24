import html from './html';

function demo() {
  function Comp({ name, children }: { name: string; children: string }) {
    const inner = children ? html`<p>${children}</p>` : null;

    return html`
      <div className="Comp ${name}">
        <h1>Sup, ${name}</h1>
        ${inner}
      </div>
    `;
  }

  function Empty({ id }: { id: string }) {
    return html`<span id=${id} />`;
  }

  function MyComp({ children, names = [] }: { children: string; names: string[] }) {
    return html`
      <div className="MyComp">
        <x-Comp name="parent"> ${children} </x-Comp>
        ${names.map((name) => html`<x-Comp name=${name} />`)}
        <x-Empty id="bazbaz"></x-Empty>
      </div>
    `.bind({ Empty, Comp });
  }

  const objProps = { foo: 'bar', baz: 'baz' };

  return html`
    <div
      data-empty=""
      data-tricky="\\"I'm a quote!\\""
      data-tricky-single='"I\\'m a quote!"'
      data-true
      async
      checked=""
      autocomplete=${false}
      data-null=${null}
      data-undef=${undefined}
      ${objProps}
      ${['data-butts', 'disabled']}
      ${'butts="nice" pissoff'}
    >
      <x-MyComp names=${['foo', 'bar']}>
        A very long run-on sentance that should be formatted properly.
      </x-MyComp>
    </div>
    <div>
      <input type="text">
      <input type="text">A bunch of nothing</input>
    </div>
  `.bind({ MyComp });
}

console.log(`${demo()}`);
