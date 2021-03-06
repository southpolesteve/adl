import { v3 } from '@azure-tools/openapi';
import { anonymous, nameOf, refTo, use } from '@azure-tools/sourcemap';
import { Header } from '../../../model/http/header';
import { singleOrDefault } from '../common';
import { processInline } from './schema';
import { Context } from './serializer';

export async function* header(header: v3.Header, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Header> {
  const { api, visitor } = $;
  const name = options?.isAnonymous ? anonymous('header') : nameOf(header);

  // these are in the OAI schema, but should not be in headers - freakout if they are used
  use(header.explode) && $.error('header definitions must not contain property \'explode\'', header.explode);
  use(header.required) && $.warn('header definitions should not contain property \'required\'', header.required);

  // get the schema for the header 
  const schema = await singleOrDefault(processInline(header.schema, $, { isAnonymous: true }));

  // create the http header object and track it. 
  const httpHeader = new Header({
    // maintain the key
    name: name.toString(),
    // use the schema
    schema,
    // set a specific value 
    description: header.description,
    // set the style value
    style: use(header.style),
  });

  // best practice - put this into the $refs collection early 
  if (!options?.isAnonymous) {
    visitor.$refs.set(refTo(header), [httpHeader]);
  }

  // preserve data that we're not using
  httpHeader.addToAttic('example', use(header.example));

  yield httpHeader;
}
