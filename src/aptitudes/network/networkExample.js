import { network } from '@oliveai/ldk';
import { oneLine } from 'common-tags';
import { format } from 'date-fns';

const newRequestHeaders = {'apikey': ['WTL49eehXWUdgqGmDOgs2kErBNcm8c3f'], 'Content-Type': ['application/json']}

const run = async (firstName, middleName, lastName, ssn, gender, dob) => {
  
  const request = {
    method: 'POST',
    headers: newRequestHeaders,
    url: 'https://sandbox-api.va.gov/services/veteran_confirmation/v0/status',
    body: oneLine `{
      "ssn": "${ssn}",
      "gender": "${gender}",
      "last_name": "${lastName}",
      "birth_date": "${dob}",
      "first_name": "${firstName}",
      "middle_name": "${middleName}"
    }`
  };  
console.log(JSON.stringify(request));
  const response = await network.httpRequest(request);
  const decodedBody = await network.decode(response.body);
  const parsedObject = JSON.parse(decodedBody);
  const veteran_status = parsedObject.veteran_status;
  console.log('vetstat: ' + veteran_status);
  return veteran_status;
};

export default { run };
