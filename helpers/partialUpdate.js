/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: the object of columns and values you want to update
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

function sqlForPartialUpdate(
  table,
  objColumnsAndValues,
  primaryKeyColumn,
  primaryKeyValue
) {
  // keep track of item indexes
  // store all the columns we want to update and associate with vals

  let idx = 1;
  let columnHeaders = [];

  // filter out keys that start with "_" -- we don't want these in DB
  for (let col in objColumnsAndValues) {
    if (col.startsWith('_')) {
      delete objColumnsAndValues[col];
    }
  }

  for (let column in objColumnsAndValues) {
    columnHeaders.push(`${column}=$${idx}`);
    idx += 1;
  }

  // build query
  let columnHeadersString = columnHeaders.join(', ');

  let query = `UPDATE ${table} SET ${columnHeadersString} WHERE ${primaryKeyColumn}=$${idx} RETURNING *`;

  //values should be an array of all the values to change
  let values = [];

  for (let columnName in objColumnsAndValues) {
    values.push(objColumnsAndValues[columnName]);
  }
  values.push(primaryKeyValue);

  return { query, values };
}

module.exports = sqlForPartialUpdate;
