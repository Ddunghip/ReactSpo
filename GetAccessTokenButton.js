import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ProductEditor from './ProductEditor';



const GetTokenButton = ({ provider }) => {

  const [dataspo, setDataspo] = useState([]);
  const [actoken, setactoken] = useState([]);
  const [showeditor, setEditor] = useState(false);
  const [showcreate, setCreate] = useState(false);

  const [checkitem, setcheckitem] = useState([]);
  const siteId = 'modernofficetech.sharepoint.com,1da6c0dd-1a36-4a65-9620-e7c44cffa4c2,bdc2a6f7-94b2-4fc2-8d6e-4fcb7656a517';
  const listId = 'b5b7a913-41bb-4c24-bc7e-7af15a7f4c8b';



  const getAuthToken = async () => {
    await provider.getAccessToken().then(token => {
      setactoken(token.accessToken)
    })
  }
  // Get Access Token


  // Get data from sharepoint
  useEffect(() => {
    if (actoken && actoken.length > 0) {
      axios({
        method: "get",
        url: `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?$Select=Id&$expand=fields`,
        headers: {
          Authorization: "Bearer " + actoken,
          Accept: '*/*'
        }
      }).then(response => {
        console.log(response.data.value)
        let raw = response.data.value
        let result = []
        if (raw && raw.length > 0) {
          raw.map(item => {
            let obj = {};
            obj.id = item.id;
            obj.Title = item.fields.Title
            obj.Price = item.fields.Price
            obj.Category = item.fields.Category
            obj.Description = item.fields.Description
            result.push(obj)
          })
        }
        setDataspo(result)

      })
        .catch(error => {
          console.log(error.response)
        })

    }

  }, [actoken, showeditor])

  const handleDelete = async (id) => {
    let data = dataspo
    data = data.filter(item => item.id !== id)
    setDataspo(data)

    await axios({
      method: 'delete',
      url: `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${id}`,
      headers: {
        Authorization: "Bearer " + actoken,
        Accept: '*/*'
      }
    }).then(response => {
      console.log(response)
    })
      .catch(error => {
        console.log(error.response)
      })

  }
  const handlePatch = (item) => {
    console.log('check item', item);
    setEditor(true)
    setcheckitem(item)
    setCreate(false)


  }
  const callbackFunction = (a) => {
    setEditor(a)
    setCreate(false)

  }
  const handleCreate = () => {
    console.log('check', showcreate);
    setCreate(true)
    setEditor(false)

  }
  return (
    <div style={{ margin: '40px 0' }}>

      <button onClick={getAuthToken} className="Button">
        Get Access Token And Data sharepoint
      </button>
      {/* Show data */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>

          </tr>
        </thead>
        <tbody>
          {dataspo && dataspo.length > 0 &&
            dataspo.map(item => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.Title}</td>
                  <td>{item.Category}</td>
                  <td>{item.Description}</td>
                  <td>{item.Price}</td>
                  <button onClick={() => handleDelete(item.id)}>X</button>
                  <button onClick={() => handlePatch(item)}>Details</button>


                </tr>
              )
            })}
        </tbody>
      </table>
      {actoken && actoken.length > 0 &&
        <button style={{ margin: '10px 0' }} className='Button' onClick={() => handleCreate()}> Add New</button>}
      {
        showeditor &&
        <ProductEditor
          datachild={checkitem}
          showedit={showeditor}
          Callback={callbackFunction}
          actoken={actoken}
        />
      }
      {showcreate &&
        <ProductEditor
          datachild={''}
          showcreate={showcreate}
          Callback={callbackFunction}
          actoken={actoken}
        />}
    </div>
  );
}
export default GetTokenButton;