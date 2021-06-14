import { useRef, useEffect } from 'react';

// checks for unload event properly src: https://stackoverflow.com/questions/39094138/reactjs-event-listener-beforeunload-added-but-not-removed/39094299

const useUnload = fn => {
  const cb = useRef(fn); // init with fn, so that type checkers won't assume that current might be undefined

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = (...args) => cb.current?.(...args);

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);
};

export default useUnload;
