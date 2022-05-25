import React, { Component, useState } from 'react';
import axios from 'axios';


const ProductEditor = (data) => {
    const siteId = 'modernofficetech.sharepoint.com,1da6c0dd-1a36-4a65-9620-e7c44cffa4c2,bdc2a6f7-94b2-4fc2-8d6e-4fcb7656a517';
    const listId = 'b5b7a913-41bb-4c24-bc7e-7af15a7f4c8b';
    const [title, setTitle] = useState(data.datachild.Title);
    const [category, setCategory] = useState(data.datachild.Category);
    const [description, setDescription] = useState(data.datachild.Description);
    const [price, setPrice] = useState(data.datachild.Price);



    const CancelFunc = (a) => {

        data.Callback(a)
    }
    const handleSave = async () => {


        await axios({
            method: "patch",
            url: `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${data.datachild.id}/fields`,
            headers: {
                Authorization: "Bearer " + data.actoken,
                Accept: '*/*'
            },
            data: {
                "Title": title,
                "Description": description,
                "Category": category,
                "Price": price

            }
        }).then(response => {
            console.log(response)
        })
            .catch(error => {
                console.log(error.response)
            })
        CancelFunc();


    }
    const handleCreate = async () => {


        await axios({
            method: "post",
            url: `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`,
            headers: {
                Authorization: "Bearer " + data.actoken,
                Accept: '*/*'
            },
            data: {
                "fields": {
                    "Title": title,
                    "Description": description,
                    "Category": category,
                    "Price": price
                }

            }
        }).then(response => {
            console.log(response.data.value)
        })
            .catch(error => {
                console.log(error.response)
            })
        CancelFunc();


    }

    return (
        <>
            <hr />

            <div key={data.datachild.id}>
                <div>
                    <label>ID:</label>

                    <input name="id"
                        disabled
                        value={data.datachild.id}
                    />
                </div>
                <div>
                    <label>Title:</label>

                    <input name='title'
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}

                    />
                </div>
                <div>
                    <label>Category:</label>

                    <input name="category"
                        type="text"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}

                    />
                </div>
                <div>
                    <label>Description:</label>

                    <input name="description"
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}

                    />
                </div>
                <div>
                    <label>Price:</label>

                    <input name="price"
                        type="text"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}

                    />
                </div>



            </div>
            {data.showedit && <button onClick={handleSave} >Save</button>}
            {data.showcreate && <button onClick={handleCreate} >Save</button>}
            <button onClick={() => CancelFunc(false)}>Cancel</button>



        </>
    )
}

export default ProductEditor;