/**
 * will always return a json<br/>
 * already pre appended with 'api/'
 */
export async function doGet(url: string) {
  const res = await fetch(`api/${url}`);
  const json = res.json();
  return json;
}

/**
 * will always return json<br>
 * already pre appended with 'api/'
 */
export async function doPost(url: string, body?: any) {
  const res = await fetch(`api/${url}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = res.json();
  return json;
}
