const util = require('util')

const {
  NodeVM
} = require('vm2');

console.log('Arguments =', util.inspect(args, false, 1, true));

/**
 * @title Eval JS
 * @category JavaScript
 * @author Anonimus
 * @param {JavaScript} script - Available variables to mutate: `user`, `temp`, `session`
 */
function RUN_JS(script) {
  const vm = new NodeVM({
    compiler: 'javascript',
    console: 'inherit',
    nesting: false,
    wrapper: 'none',
    sandbox: {
      user,
      temp,
      session
    }
  });

  vm.run(script);
}

return RUN_JS(args.script);
