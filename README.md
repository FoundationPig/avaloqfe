Views for react application

#Code Explanation
We are using react charts dependency "react-chartjs-2": "^2.11.1" to view data as charts in the 
component MyChart.js

The separation of view for buzz, fizz, and buzzfizz is passed through the props "type" of MyChart

#App.js

    function App() {
    return (
    <div style={{display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"}}>
    <MyChart type="fizz" />
    <MyChart type="fizzbuzz" />
    <MyChart type="buzz" />
    </div>
    
        );
    }
    export default App;

#MyChart.js

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

#Possible Enhancement on the views
The current setup is able to view the data of fizz, buzz, and fizzbuzz
on their own respective chart but still lacks a few components

1. Add a spinner on ajax request to server  
2. Add error handling on views  
3. Add handling from different screen dimensions   

Additional enhancement is needed on BE side as well to
allow only requests from UI's host to eliminate man in the middle 
security issue.

#DockerFile

    #Stage 1 
    FROM node:10-alpine as build-step
    RUN mkdir /app
    WORKDIR /app
    COPY package.json /app
    RUN npm install
    COPY . /app
    RUN npm run build

    # Stage 2  
    FROM nginx:1.17.1-alpine
    COPY --from=build-step /app/build /usr/share/nginx/html

This Dockerfile is separated into two stages  


#Stage 1  
1st line gets node base image from dockerhub and names as build-step  
2nd line creates /app directory  
3rd line makes /app as working directory  
4th line copies the package.json to /app  
5th line runs npm install which installs node dependencies  
6th line copies current directory to /app (note that "node_modules" is inside .dockerignore file)   
7th line runs command to webpack application for production in /app/build folder  

#Stage 2
1st line gets nginx base image  
2nd line copies /app/build from previous stage to nginx default folder /usr/share/nginx/html which runs the index.html file of the build

#CI/CD setup

#Steps  
Create "build" jenkins pipeline for development with the following steps  

Parameters:  
1. branch/image tag

Steps:  
1. run unit tests
2. Code Coverage  
3. Security scans (Webinspect, Fortify, Sonarqube)  
4. build docker image
5. deploy image to environment dev environment with temporary container
7. if container isn't healthy remove temporary container (exit jenkins with error)
8. if container is running successfully in dev environment delete old container 
   and replace with the latest build container
9. push image to dockerhub/repository with unique tag


Create "deploy" jenkins pipeline with the following steps and parameters  

Parameters:
1. branch or docker image tag
2. environment to deploy(sit, uat, prod)

Steps:
1. downloads specific image from dockerhub/repository if parameter is not specified gets latest
5. deploy image to environment target environment with temporary container
7. if container isn't healthy remove temporary container (exit jenkins with error)
8. if container is running successfully environment delete old container
   and replace with the latest build container

#Hooks
With the above steps we can create hooks to implement CI/CD

1. Set jenkins to listen to merged pull request on a set branch("develop") and trigger "build" step to deploy to dev environment  
2. Use "deploy" step to deploy to higher environments.

#Notes
This CI/CD setup builds docker images only once in "build" step removing overhead rather than building everytime per environment. This build step 
already contains the necessary filters such as code scans, unit tests ...
that are needed to deploy built docker image in dev 
environment as well as the only credential allowed to push images 
to dockerhub/repository to ensure pushed images have gone through the
necessary filtering steps. 

For deployment to higher environments
you can use "deploy" pipeline or 
add more hooks to trigger automatically or 
manually depending on the agreed upon process. 
