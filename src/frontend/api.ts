async function update(files: string[]): Promise<object[]> {
  // Want to make a network request to the API and update the JSON objects.
  console.log('update.files:', files);

  const query = fileQuery(files)
  const url = encodeURI(`/api/update?${query}`)
  const response = await fetch(url);

  if (!response.ok) {
    return await Promise.reject(response);
  }

  return response.json();
}

function fileQuery(files: string[]): string {
  return files.map(file => `files=${file}`).join('&');
}

type Error = {
  error: string;
}

const isError = (input: object): input is Error => 'error' in input;

export default { update, Error, isError }
