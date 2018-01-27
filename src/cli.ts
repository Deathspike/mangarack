import * as cli from './cli/';
export {cli}

(function() {
  if (require.main === module) {
    cli.parseAsync(process.argv).catch(error => console.log(error));
  }
})();
