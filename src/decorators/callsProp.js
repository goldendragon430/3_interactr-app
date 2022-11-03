export default propName => (target, name, descriptor) => {
  const fn = descriptor.value;

  return {
    configurable: true,

    get(key) {
      let boundFn = fn.bind(this);

      Reflect.defineProperty(this, key, {
        value: boundFn,
        configurable: true,
        writable: true
      });

      return (...args) => {
        const prop = this.props[propName];
        if (prop) prop(...args);
        return boundFn.apply(this, args);
      };
    }
  };
};
