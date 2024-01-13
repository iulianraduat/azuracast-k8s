# azuracast-k8s

AzuraCast as k8s deployment • Rolling Release #835a172 (2023-02-22 6:31)

## Install

In the folder were you have all .yaml files run the following command:

```
kubectl apply -f .
```

If it does not work for minikube then try:

```
minikube kubectl apply -f .
```

If it does not work for microk8s then try:

```
microk8s kubectl apply -f .
```

You should see in the default namespace defined for kubernetes all the new objects.
The corresponding service is called azuracast.

If you want to use it in a different namespace then just add "-n &lt;namespace&gt;" as argument to kubectl call.

You need to use a proxy in front of it (like nginx) to redirect to the exposed port on k8s node.
To find the mapped port for port 80 just check the "Internal Endpoints" of the service "azuracast" or run `kubectl get svc` from the shell of the server running the cluster.

Please configure your stations to stream via http so you do not need to use one port per station.

## Notice

The .yaml files are generated from the docker-compose.yml of the specified release.

## Differences k8s vs docker-compose

* There is no NetworkPolicy applied (it exists in docker but is was removed from k8s).
It is still include as the file "bin-default-networkpolicy.yaml.ignored", in case someone needs a reference to it.

* The docker allows for multiple proxy ports to be used for stations.
The k8s deployment only define one.
