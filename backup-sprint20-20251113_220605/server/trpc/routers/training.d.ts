/**
 * Training tRPC Router
 * SPRINT 10 - Model Training
 * 22+ endpoints para treinamento e avaliação de modelos
 */
export declare const trainingRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1-5: Dataset Management
     */
    createDataset: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            name: string;
            dataType: "text" | "conversation" | "qa" | "instruction";
            data: any[];
            userId: number;
            description?: string | undefined;
        };
        _input_out: {
            name: string;
            dataType: "text" | "conversation" | "qa" | "instruction";
            data: any[];
            userId: number;
            description?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        dataset: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean;
            userId: number;
            description: string | null;
            metadata: unknown;
            filePath: string | null;
            datasetType: "text" | "code" | "qa" | "completion" | "chat" | null;
            format: "jsonl" | "csv" | "txt" | "parquet" | null;
            fileSize: number | null;
            recordCount: number | null;
        };
    }>;
    listDatasets: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            userId?: number | undefined;
        };
        _input_out: {
            userId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        datasets: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean;
            userId: number;
            description: string | null;
            metadata: unknown;
            filePath: string | null;
            datasetType: "text" | "code" | "qa" | "completion" | "chat" | null;
            format: "jsonl" | "csv" | "txt" | "parquet" | null;
            fileSize: number | null;
            recordCount: number | null;
        }[];
    }>;
    getDataset: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        dataset: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean;
            userId: number;
            description: string | null;
            metadata: unknown;
            filePath: string | null;
            datasetType: "text" | "code" | "qa" | "completion" | "chat" | null;
            format: "jsonl" | "csv" | "txt" | "parquet" | null;
            fileSize: number | null;
            recordCount: number | null;
        };
    }>;
    deleteDataset: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
    validateDataset: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            dataType: "text" | "conversation" | "qa" | "instruction";
            data: any[];
        };
        _input_out: {
            dataType: "text" | "conversation" | "qa" | "instruction";
            data: any[];
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        valid: boolean;
        message: any;
    }>;
    /**
     * 6-12: Training Job Management
     */
    startTraining: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            modelId: number;
            datasetId: number;
            hyperparameters: {
                learningRate: number;
                batchSize: number;
                epochs: number;
                warmupSteps?: number | undefined;
                maxSteps?: number | undefined;
                loraRank?: number | undefined;
                loraAlpha?: number | undefined;
                loraDropout?: number | undefined;
            };
            validationSplit?: number | undefined;
            earlyStopping?: boolean | undefined;
            checkpointInterval?: number | undefined;
        };
        _input_out: {
            modelId: number;
            datasetId: number;
            hyperparameters: {
                learningRate: number;
                batchSize: number;
                epochs: number;
                warmupSteps?: number | undefined;
                maxSteps?: number | undefined;
                loraRank?: number | undefined;
                loraAlpha?: number | undefined;
                loraDropout?: number | undefined;
            };
            validationSplit?: number | undefined;
            earlyStopping?: boolean | undefined;
            checkpointInterval?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        job: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            userId: number;
            description: string | null;
            metadata: unknown;
            status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
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
        };
    }>;
    listTrainingJobs: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            userId?: number | undefined;
            status?: "completed" | "failed" | "cancelled" | "running" | undefined;
        };
        _input_out: {
            userId?: number | undefined;
            status?: "completed" | "failed" | "cancelled" | "running" | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        jobs: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            userId: number;
            description: string | null;
            metadata: unknown;
            status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
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
        }[];
    }>;
    getTrainingStatus: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            jobId: number;
        };
        _input_out: {
            jobId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        status: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            userId: number;
            description: string | null;
            metadata: unknown;
            status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
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
        };
    }>;
    cancelTraining: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            jobId: number;
        };
        _input_out: {
            jobId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
    getTrainingMetrics: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            jobId: number;
        };
        _input_out: {
            jobId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        metrics: {
            currentEpoch: number | null;
            status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
            startTime: Date | null;
            endTime: Date | null;
            metadata: unknown;
        };
    }>;
    getTrainingLogs: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            jobId: number;
            limit?: number | undefined;
        };
        _input_out: {
            limit: number;
            jobId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        logs: {
            timestamp: Date;
            level: string;
            message: string;
        }[];
    }>;
    pauseTraining: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            jobId: number;
        };
        _input_out: {
            jobId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
    /**
     * 13-17: Model Evaluation
     */
    evaluateModel: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            modelVersionId: number;
            testDatasetId: number;
        };
        _input_out: {
            modelVersionId: number;
            testDatasetId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        evaluation: import("../../services/modelTrainingService.js").EvaluationResult;
    }>;
    benchmarkModel: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            modelVersionId: number;
            benchmarkType: "speed" | "accuracy" | "perplexity" | "all";
        };
        _input_out: {
            modelVersionId: number;
            benchmarkType: "speed" | "accuracy" | "perplexity" | "all";
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        benchmark: {
            type: "speed" | "accuracy" | "perplexity" | "all";
            score: number;
            timestamp: Date;
        };
    }>;
    compareModels: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            testDatasetId: number;
            modelVersionIds: number[];
        };
        _input_out: {
            testDatasetId: number;
            modelVersionIds: number[];
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        comparisons: {
            accuracy: number;
            loss: number;
            perplexity: number;
            examples: Array<{
                input: string;
                expected: string;
                generated: string;
                score: number;
            }>;
            modelVersionId: number;
        }[];
    }>;
    getModelMetrics: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            modelVersionId: number;
        };
        _input_out: {
            modelVersionId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        metrics: {
            accuracy: number;
            loss: number;
            perplexity: number;
            f1Score: number;
        };
    }>;
    exportModel: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            format: "gguf" | "safetensors" | "pytorch" | "onnx";
            modelVersionId: number;
        };
        _input_out: {
            format: "gguf" | "safetensors" | "pytorch" | "onnx";
            modelVersionId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        exportPath: string;
        message: string;
    }>;
    /**
     * 18-22: Advanced Features
     */
    createFineTuningConfig: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            name: string;
            baseConfig: {
                learningRate: number;
                batchSize: number;
                epochs: number;
            };
            advancedOptions?: any;
        };
        _input_out: {
            name: string;
            baseConfig: {
                learningRate: number;
                batchSize: number;
                epochs: number;
            };
            advancedOptions?: any;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        config: {
            createdAt: Date;
            name: string;
            baseConfig: {
                learningRate: number;
                batchSize: number;
                epochs: number;
            };
            advancedOptions?: any;
            id: number;
        };
    }>;
    listFineTuningConfigs: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        configs: {
            id: number;
            name: string;
            baseConfig: {
                learningRate: number;
                batchSize: number;
                epochs: number;
            };
        }[];
    }>;
    estimateTrainingTime: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            batchSize: number;
            epochs: number;
            datasetSize: number;
            modelSize: "medium" | "small" | "large" | "xlarge";
        };
        _input_out: {
            batchSize: number;
            epochs: number;
            datasetSize: number;
            modelSize: "medium" | "small" | "large" | "xlarge";
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        estimate: {
            totalSteps: number;
            estimatedMinutes: number;
            estimatedHours: number;
        };
    }>;
    getHyperparameterRecommendations: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            taskType: "qa" | "classification" | "generation" | "summarization";
            datasetSize: number;
            modelSize: "medium" | "small" | "large" | "xlarge";
        };
        _input_out: {
            taskType: "qa" | "classification" | "generation" | "summarization";
            datasetSize: number;
            modelSize: "medium" | "small" | "large" | "xlarge";
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        recommendations: {
            learningRate: number;
            batchSize: number;
            epochs: number;
        } | {
            learningRate: number;
            batchSize: number;
            epochs: number;
        } | {
            learningRate: number;
            batchSize: number;
            epochs: number;
        } | {
            learningRate: number;
            batchSize: number;
            epochs: number;
        };
    }>;
    scheduleTraining: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            scheduledTime: string;
            jobConfig?: any;
        };
        _input_out: {
            scheduledTime: string;
            jobConfig?: any;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        scheduledJob: {
            status: string;
            scheduledTime: string;
            jobConfig?: any;
            id: number;
        };
    }>;
}>;
