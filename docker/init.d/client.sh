#!/bin/bash
function wait_for_keycloak() {
    local -r MAX_WAIT=240
    local curl_request
    local host_url="http://localhost:8080/"
    local wait_time

    curl_request="curl -I -f -s ${host_url}"
    wait_time=0

    # Waiting for the application to return a 200 status code.
    until ${curl_request}; do
        if [[ ${wait_time} -ge ${MAX_WAIT} ]]; then
            echo "The application service did not start within ${MAX_WAIT} seconds. Aborting."
            exit 1
        else
            echo "Waiting (${wait_time}/${MAX_WAIT}) ..."
            sleep 1
            ((++wait_time))
        fi
    done

    echo "${host_url} is now up and running."
}

# Waiting for Keycloak to start before proceeding with the configurations.
wait_for_keycloak

# Keycloak is running.
echo "############################"
echo " Calling configure_keycloak"
echo "############################"

# Login in keycloak
/opt/keycloak/bin/./kcadm.sh config credentials --server http://localhost:8080/ --realm master --user ${KEYCLOAK_ADMIN} --password ${KEYCLOAK_ADMIN_PASSWORD}
######################################
# REALM MASTER
######################################
# Create client from connect the gateway to keycloak
CLIENT_ID=9d0c6626-5b6d-4c58-8f14-3c23b1e3e994 #Id of the client 

sed -e "s/\"id\": \"clientID\"/\"id\": \"$CLIENT_ID\"/g" -i /opt/keycloak/bin/clients/client_master.json                      #use id of the client in json id
sed -e "s/\"clientId\": \"kcClientID\"/\"clientId\": \"$KC_CLIENTID\"/g" -i /opt/keycloak/bin/clients/client_master.json      #use client id in json clientId
sed -e "s/\"name\": \"kcClientID\"/\"name\": \"$KC_CLIENTID\"/g" -i /opt/keycloak/bin/clients/client_master.json              #use client id in json name
sed -e "s/\"secret\": \"kcClientSecret\"/\"secret\": \"$KC_CLIENT_SECRET\"/g" -i /opt/keycloak/bin/clients/client_master.json #use client secret in json secret
/opt/keycloak/bin/./kcadm.sh create clients -r master -f /opt/keycloak/bin/clients/client_master.json
/opt/keycloak/bin/./kcadm.sh add-roles -r master --uusername service-account-${KC_CLIENTID} --rolename ${KEYCLOAK_ADMIN} --rolename create-realm --rolename offline_access --rolename uma_authorization

# Update admin user email
ADMIN_ID=$(/opt/keycloak/bin/./kcadm.sh get users -r master | grep -i ${KEYCLOAK_ADMIN} -B2 | grep -i id | cut -d'"' -f4)
/opt/keycloak/bin/./kcadm.sh update users/${ADMIN_ID} -r master -f /opt/keycloak/bin/users/user_master_admin.json

echo "End of configure_keycloak"
