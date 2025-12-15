import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  // State management
  products: Product[] = [];
  filteredProducts: Product[] = [];
  showForm = false;
  isEditMode = false;
  currentProductId: number | null = null;
  
  // Search and filter
  searchTerm = '';
  selectedCategory = '';
  categories = ['', 'shampoing', 'gel', 'cire', 'huile', 'serum', 'autre'];
  
  // Form
  productForm!: FormGroup;
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form
   */
  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      brand: ['', [Validators.required, Validators.minLength(2)]],
      inStock: [true]
    });
  }

  /**
   * Load all products from service
   */
  private loadProducts(): void {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.applyFilters();
        },
        error: (error) => {
          this.showError('Erreur lors du chargement des produits');
          console.error('Error loading products:', error);
        }
      });
  }

  /**
   * Apply search and category filters
   */
  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  /**
   * Handle search input change
   */
  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  /**
   * Handle category filter change
   */
  onCategoryChange(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  /**
   * Show add product form
   */
  showAddForm(): void {
    this.isEditMode = false;
    this.currentProductId = null;
    this.productForm.reset({ inStock: true });
    this.showForm = true;
    this.clearMessages();
  }

  /**
   * Show edit product form
   */
  editProduct(product: Product): void {
    this.isEditMode = true;
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
    this.showForm = true;
    this.clearMessages();
  }

  /**
   * Cancel form
   */
  cancelForm(): void {
    this.showForm = false;
    this.productForm.reset();
    this.isEditMode = false;
    this.currentProductId = null;
    this.clearMessages();
  }

  /**
   * Submit form (add or update)
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.showError('Veuillez remplir tous les champs obligatoires correctement');
      return;
    }

    const productData: Product = {
      ...this.productForm.value,
      id: this.currentProductId || 0
    };

    if (this.isEditMode && this.currentProductId) {
      this.updateProduct(this.currentProductId, productData);
    } else {
      this.addProduct(productData);
    }
  }

  /**
   * Add new product
   */
  private addProduct(product: Product): void {
    this.productService.addProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('Produit ajouté avec succès');
          this.cancelForm();
        },
        error: (error) => {
          this.showError('Erreur lors de l\'ajout du produit');
          console.error('Error adding product:', error);
        }
      });
  }

  /**
   * Update existing product
   */
  private updateProduct(id: number, product: Product): void {
    this.productService.updateProduct(id, product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('Produit mis à jour avec succès');
          this.cancelForm();
        },
        error: (error) => {
          this.showError('Erreur lors de la mise à jour du produit');
          console.error('Error updating product:', error);
        }
      });
  }

  /**
   * Delete product with confirmation
   */
  deleteProduct(product: Product): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      this.productService.deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSuccess('Produit supprimé avec succès');
          },
          error: (error) => {
            this.showError('Erreur lors de la suppression du produit');
            console.error('Error deleting product:', error);
          }
        });
    }
  }

  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  /**
   * Clear all messages
   */
  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  /**
   * Get form control for template access
   */
  get f() {
    return this.productForm.controls;
  }
}
