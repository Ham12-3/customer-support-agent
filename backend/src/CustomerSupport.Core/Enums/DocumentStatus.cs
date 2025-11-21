namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the processing status of an uploaded document
/// </summary>
public enum DocumentStatus
{
    /// <summary>
    /// Document is being processed
    /// </summary>
    Processing = 0,

    /// <summary>
    /// Document has been successfully processed and indexed
    /// </summary>
    Completed = 1,

    /// <summary>
    /// Document processing failed
    /// </summary>
    Failed = 2,

    /// <summary>
    /// Document is queued for processing
    /// </summary>
    Queued = 3
}

