#!/bin/bash
function main() {
    # Parameters
    local keycloak_cmd_arguments=("$@")
    local spi_arguments="--spi-login-freemarker-enabled=false --spi-login-csps-freemarker-login-messages-enabled=true --spi-eventsListener-csps-login-event-listener-enabled=true --spi-eventsListener-csps-logout-event-listener-enabled=true --spi-theme-welcome-theme=csps"
    #run client on background
    /opt/keycloak/bin/./client.sh &
    
    echo ""
    echo ""
    echo "##########################"
    echo " Starting Keycloak Script "
    echo "##########################"
    echo ""
    echo ""

    # Launch base container entrypoint with container's runtime cmd arguments..."
    case "${ENVIRONMENT_NAME}" in
    dev-local)
        /opt/keycloak/bin/kc.sh start-dev --auto-build --features=token-exchange --log-level=WARN
        ;;
    *)
        /opt/keycloak/bin/kc.sh "${keycloak_cmd_arguments[@]}" "${spi_arguments}"
        ;;
    esac
}

main "$@"
