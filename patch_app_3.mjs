import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

const oldCatch = `    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Other functions like prompt change, gender detect etc remain same) ...`;

const newCatch = `    } catch (err: any) {
      console.error("Failed to generate script", err);
      if (err.message === "QUOTA_EXHAUSTED") {
          setShowQuotaModal(true);
          setError("Kuota server habis. Silakan masukkan API Key Anda sendiri.");
      } else {
          setError(err.message || 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Other functions like prompt change, gender detect etc remain same) ...`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('App.tsx', code);
