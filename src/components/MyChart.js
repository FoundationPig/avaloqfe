import React, {useState} from 'react'
import {Bar} from 'react-chartjs-2'

const MyChart = (props) => {
    const handleParamChange = event => setInputParameter(event.target.value)
    const [inputParameter, setInputParameter] = useState();
    const [gridData, setGridData] = useState();
    const handleSubmit = event => {
        event.preventDefault();
        fetch(`http://localhost:8080/buzzfizz?data=${inputParameter}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setGridData({
                        labels: Object.keys(result[props.type]).map(val => val + "id"),
                        datasets: [{
                            label: props.type,
                            data: result[props.type],
                            borderWidth: 1
                        }]
                    })
                },
            )
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        <p>Name</p>
                        <input type='text' value={inputParameter} onChange={handleParamChange} />
                    </label>
                    <button type="submit">Submit</button>
                </fieldset>
            </form>
            <Bar
                data={gridData}
                width={600}
                height={300}
            />
        </div>
    )
}
export default MyChart