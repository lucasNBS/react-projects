import { useState } from "react";
import { Editor } from "./components/Editor";
import { useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [sourceDoc, setSourceDoc] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSourceDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <>
      <div className="pane top-pane">
        <Editor language="xml" name="HTML" value={html} onChange={setHtml} />
        <Editor language="css" name="CSS" value={css} onChange={setCss} />
        <Editor language="javascript" name="JS" value={js} onChange={setJs} />
      </div>
      <div className="pane">
        <iframe
          srcDoc={sourceDoc}
          title="output"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}

export default App;
