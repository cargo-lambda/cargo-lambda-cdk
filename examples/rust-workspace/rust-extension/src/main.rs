use lambda_extension::*;
use tracing::info;

async fn events_extension(event: LambdaEvent) -> Result<(), Error> {
    match event.next {
        NextEvent::Shutdown(e) => {
            info!(event_type = "shutdown", event = ?e, "shutting down");
        }
        NextEvent::Invoke(e) => {
            info!(event_type = "invoke", event = ?e, "invoking function");
        }
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // The runtime logging can be enabled here by initializing `tracing` with `tracing-subscriber`
    // While `tracing` is used internally, `log` can be used as well if preferred.
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    
    Extension::new()
        .with_events_processor(service_fn(events_extension))
        .run()
        .await
}