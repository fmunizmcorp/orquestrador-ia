interface TrainingConfig {
    modelId: number;
    datasetId: number;
    hyperparameters: {
        learningRate: number;
        batchSize: number;
        epochs: number;
        warmupSteps?: number;
        maxSteps?: number;
        loraRank?: number;
        loraAlpha?: number;
        loraDropout?: number;
    };
    validationSplit?: number;
    earlyStopping?: boolean;
    checkpointInterval?: number;
}
export interface EvaluationResult {
    accuracy: number;
    loss: number;
    perplexity: number;
    examples: Array<{
        input: string;
        expected: string;
        generated: string;
        score: number;
    }>;
}
declare class ModelTrainingService {
    private trainingProcesses;
    private readonly trainingDataPath;
    private readonly checkpointsPath;
    constructor();
    private initializeDirectories;
    /**
     * Create a new training dataset
     */
    createDataset(userId: number, name: string, description: string, dataType: 'text' | 'qa' | 'conversation' | 'instruction', data: any[]): Promise<{
        description: string | null;
        userId: number;
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        isActive: boolean;
        metadata: unknown;
        filePath: string | null;
        datasetType: "code" | "text" | "qa" | "completion" | "chat" | null;
        format: "jsonl" | "csv" | "txt" | "parquet" | null;
        fileSize: number | null;
        recordCount: number | null;
    }>;
    /**
     * Validate dataset format
     */
    private validateDataset;
    /**
     * Calculate dataset statistics
     */
    private calculateDatasetStats;
    /**
     * Start a training job
     */
    startTraining(config: TrainingConfig): Promise<{
        description: string | null;
        userId: number;
        status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        metadata: unknown;
        progress: string | null;
        completedAt: Date | null;
        datasetId: number;
        baseModelId: number;
        trainingType: "fine-tuning" | "lora" | "qlora" | "full" | null;
        hyperparameters: unknown;
        currentEpoch: number | null;
        totalEpochs: number | null;
        trainingLoss: string | null;
        validationLoss: string | null;
        trainingAccuracy: string | null;
        validationAccuracy: string | null;
        estimatedTimeRemaining: number | null;
        startedAt: Date | null;
        errorMessage: string | null;
        logFilePath: string | null;
    }>;
    /**
     * Run training process
     */
    private runTraining;
    /**
     * Simulate a training step
     */
    private trainStep;
    /**
     * Evaluate a validation batch
     */
    private evaluateStep;
    /**
     * Save training checkpoint
     */
    private saveCheckpoint;
    /**
     * Get training job status
     */
    getTrainingStatus(jobId: number): Promise<{
        description: string | null;
        userId: number;
        status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        metadata: unknown;
        progress: string | null;
        completedAt: Date | null;
        datasetId: number;
        baseModelId: number;
        trainingType: "fine-tuning" | "lora" | "qlora" | "full" | null;
        hyperparameters: unknown;
        currentEpoch: number | null;
        totalEpochs: number | null;
        trainingLoss: string | null;
        validationLoss: string | null;
        trainingAccuracy: string | null;
        validationAccuracy: string | null;
        estimatedTimeRemaining: number | null;
        startedAt: Date | null;
        errorMessage: string | null;
        logFilePath: string | null;
    }>;
    /**
     * Cancel training job
     */
    cancelTraining(jobId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Evaluate trained model
     */
    evaluateModel(modelVersionId: number, testDatasetId: number): Promise<EvaluationResult>;
    /**
     * Calculate text similarity (simple Levenshtein-based metric)
     */
    private calculateSimilarity;
    /**
     * Levenshtein distance algorithm
     */
    private levenshteinDistance;
    /**
     * List all training jobs
     */
    listTrainingJobs(userId?: number, status?: string): Promise<{
        description: string | null;
        userId: number;
        status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        metadata: unknown;
        progress: string | null;
        completedAt: Date | null;
        datasetId: number;
        baseModelId: number;
        trainingType: "fine-tuning" | "lora" | "qlora" | "full" | null;
        hyperparameters: unknown;
        currentEpoch: number | null;
        totalEpochs: number | null;
        trainingLoss: string | null;
        validationLoss: string | null;
        trainingAccuracy: string | null;
        validationAccuracy: string | null;
        estimatedTimeRemaining: number | null;
        startedAt: Date | null;
        errorMessage: string | null;
        logFilePath: string | null;
    }[]>;
    /**
     * List all datasets
     */
    listDatasets(userId?: number): Promise<{
        description: string | null;
        userId: number;
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        isActive: boolean;
        metadata: unknown;
        filePath: string | null;
        datasetType: "code" | "text" | "qa" | "completion" | "chat" | null;
        format: "jsonl" | "csv" | "txt" | "parquet" | null;
        fileSize: number | null;
        recordCount: number | null;
    }[]>;
    /**
     * Delete dataset
     */
    deleteDataset(datasetId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare const modelTrainingService: ModelTrainingService;
export {};
