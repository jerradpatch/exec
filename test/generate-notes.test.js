import test from 'ava';
import {stub} from 'sinon';
import {generateNotes} from '..';

stub(process.stdout, 'write');
stub(process.stderr, 'write');

test.beforeEach(t => {
  // Mock logger
  t.context.log = stub();
  t.context.error = stub();
  t.context.logger = {log: t.context.log, error: t.context.error};
});

test('Return the value generateNotes script wrote to stdout', async t => {
  const pluginConfig = {
    cmd: './test/fixtures/echo-args.sh "\nRelease note \n\n"',
  };
  const context = {logger: t.context.logger};

  const result = await generateNotes(pluginConfig, context);
  t.is(result, 'Release note');
});

test('Throw "Error" if if the generateNotes script does not returns 0', async t => {
  const pluginConfig = {cmd: 'exit 1'};
  const context = {logger: t.context.logger};

  await t.throws(generateNotes(pluginConfig, context), Error);
});
