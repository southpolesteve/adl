import { v2 } from '@azure-tools/openapi';
import { anonymous, nameOf } from '@azure-tools/sourcemap';
import { Header } from '../../../model/http/header';
import { singleOrDefault } from '../common';
import { processInline } from './schema';
import { Context } from './serializer';

export async function* header(header: v2.Header, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Header> {
  const name = options?.isAnonymous ? anonymous('header') : nameOf(header);

  // get the schema for the header 
  const schema = await singleOrDefault(processInline(<v2.Schema>header, $, { isAnonymous: true }));

  // create the http header object and track it. 
  const httpHeader = new Header({
    // maintain the key
    name: name.toString(),
    // use the schema
    schema,
    // set a specific value 
    description: header.description,
  });

  yield httpHeader;
}
